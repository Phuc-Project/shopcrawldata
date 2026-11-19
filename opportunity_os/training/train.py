"""Train a simple Opportunity ranker/classifier from engineered features."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from opportunity_os.normalize.schema import OpportunityFeatures
from opportunity_os.utils.io import ensure_dir, save_json

FEATURE_COLS = [
    "demand",
    "growth",
    "competition",
    "revenue",
    "personalization",
    "seasonality",
    "production_fit",
    "listing_count",
    "shop_count",
    "avg_price",
    "avg_rating",
    "total_reviews",
    "total_favorites",
    "total_sales_est",
    "personalization_ratio",
]

LABEL_MAP = {"SKIP": 0, "WATCH": 1, "BUILD": 2}
INV_LABEL = {v: k for k, v in LABEL_MAP.items()}


def opportunities_to_frame(rows: list[OpportunityFeatures] | list[dict]) -> pd.DataFrame:
    data = []
    for r in rows:
        d = r.model_dump(mode="json") if hasattr(r, "model_dump") else dict(r)
        data.append(d)
    return pd.DataFrame(data)


def _label_from_rules(df: pd.DataFrame) -> pd.Series:
    # Prefer existing recommendation; else derive
    if "recommendation" in df.columns and df["recommendation"].notna().any():
        return df["recommendation"].map(LABEL_MAP).fillna(1).astype(int)
    y = []
    for _, row in df.iterrows():
        s = float(row.get("opportunity_score") or 0)
        pf = float(row.get("production_fit") or 0)
        if s >= 80 and pf >= 75:
            y.append(2)
        elif s >= 60:
            y.append(1)
        else:
            y.append(0)
    return pd.Series(y)


def train_models(
    opportunities: list[OpportunityFeatures] | list[dict],
    *,
    model_dir: str | Path,
    test_size: float = 0.25,
    random_state: int = 42,
) -> dict[str, Any]:
    df = opportunities_to_frame(opportunities)
    if df.empty or len(df) < 5:
        # still dump empty meta
        ensure_dir(model_dir)
        meta = {"status": "skipped", "reason": "not_enough_rows", "n": len(df)}
        save_json(Path(model_dir) / "train_meta.json", meta)
        return meta

    for c in FEATURE_COLS:
        if c not in df.columns:
            df[c] = 0.0
    X = df[FEATURE_COLS].fillna(0.0).astype(float)
    y_cls = _label_from_rules(df)
    y_reg = df["opportunity_score"].fillna(50.0).astype(float)

    # If too few classes, skip stratified split
    strat = y_cls if y_cls.nunique() > 1 and y_cls.value_counts().min() >= 2 else None
    try:
        Xtr, Xte, ytr, yte, ytr_r, yte_r = train_test_split(
            X, y_cls, y_reg, test_size=min(test_size, 0.4), random_state=random_state, stratify=strat
        )
    except ValueError:
        Xtr, Xte, ytr, yte, ytr_r, yte_r = X, X, y_cls, y_cls, y_reg, y_reg

    clf = Pipeline(
        [
            ("scaler", StandardScaler()),
            (
                "model",
                GradientBoostingClassifier(random_state=random_state),
            ),
        ]
    )
    reg = Pipeline(
        [
            ("scaler", StandardScaler()),
            (
                "model",
                GradientBoostingRegressor(random_state=random_state),
            ),
        ]
    )
    clf.fit(Xtr, ytr)
    reg.fit(Xtr, ytr_r)

    cls_acc = float((clf.predict(Xte) == yte.to_numpy()).mean()) if len(Xte) else None
    reg_mae = float(np.mean(np.abs(reg.predict(Xte) - yte_r.to_numpy()))) if len(Xte) else None

    out_dir = ensure_dir(model_dir)
    joblib.dump(clf, out_dir / "opportunity_classifier.joblib")
    joblib.dump(reg, out_dir / "opportunity_regressor.joblib")
    joblib.dump(FEATURE_COLS, out_dir / "feature_cols.joblib")

    meta = {
        "status": "ok",
        "n_samples": int(len(df)),
        "n_train": int(len(Xtr)),
        "n_test": int(len(Xte)),
        "classifier_accuracy": cls_acc,
        "regressor_mae": reg_mae,
        "label_distribution": {INV_LABEL.get(int(k), str(k)): int(v) for k, v in y_cls.value_counts().items()},
        "feature_cols": FEATURE_COLS,
    }
    save_json(out_dir / "train_meta.json", meta)
    return meta


def predict_batch(
    opportunities: list[OpportunityFeatures] | list[dict],
    *,
    model_dir: str | Path,
) -> list[dict[str, Any]]:
    model_dir = Path(model_dir)
    clf_path = model_dir / "opportunity_classifier.joblib"
    reg_path = model_dir / "opportunity_regressor.joblib"
    if not clf_path.exists():
        return []
    clf = joblib.load(clf_path)
    reg = joblib.load(reg_path) if reg_path.exists() else None
    cols = joblib.load(model_dir / "feature_cols.joblib")
    df = opportunities_to_frame(opportunities)
    for c in cols:
        if c not in df.columns:
            df[c] = 0.0
    X = df[cols].fillna(0.0).astype(float)
    pred_cls = clf.predict(X)
    pred_reg = reg.predict(X) if reg is not None else df.get("opportunity_score", 0)
    results = []
    for i, row in df.iterrows():
        results.append(
            {
                "key": row.get("key"),
                "ml_recommendation": INV_LABEL.get(int(pred_cls[i if isinstance(i, int) else 0]), "WATCH")
                if False
                else INV_LABEL.get(int(pred_cls[list(df.index).index(i)]), "WATCH"),
                "ml_score": float(pred_reg[list(df.index).index(i)]) if reg is not None else None,
                "rule_recommendation": row.get("recommendation"),
                "rule_score": row.get("opportunity_score"),
            }
        )
    # simpler loop
    results = []
    idxs = list(range(len(df)))
    for j in idxs:
        results.append(
            {
                "key": df.iloc[j].get("key"),
                "ml_recommendation": INV_LABEL.get(int(pred_cls[j]), "WATCH"),
                "ml_score": float(pred_reg[j]) if reg is not None else None,
                "rule_recommendation": df.iloc[j].get("recommendation"),
                "rule_score": df.iloc[j].get("opportunity_score"),
            }
        )
    return results
