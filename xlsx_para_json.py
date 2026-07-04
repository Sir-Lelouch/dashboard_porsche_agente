
import pandas as pd
import json

df = pd.read_excel("porsche-data.xlsx", engine="openpyxl")

dados = []

for _, r in df.iterrows():

    dados.append({
        "modelo": str(r["PorscheModelSanitized"]),
        "ano": int(r["ModelYearSanitized"]),
        "estado": str(r["StateSanitized"]),
        "pagamento": str(r["PayMethodSanitized"]),
        "valor": float(r["SalesPriceSanitized"])
    })

with open(
    "porsche-data.json",
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        dados,
        f,
        ensure_ascii=False,
        indent=2
    )

print(f"JSON criado com {len(dados)} registros.")
