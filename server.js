
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

/* middlewares */
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/* carregar dados */
const data = JSON.parse(fs.readFileSync('porsche-data.json', 'utf-8'));

/* ================= IA LOCAL ================= */
app.post('/ask', (req, res) => {

try {

const question = (req.body.question || "").toLowerCase();
const rows = req.body.data || data;

/* cálculos */
const total = rows.reduce((a,b)=>a+b.valor,0);
const avg = rows.length ? total / rows.length : 0;

/* agrupamento */
function group(arr, key){
    let result = {};
    arr.forEach(x => {
        result[x[key]] = (result[x[key]] || 0) + x.valor;
    });
    return result;
}

const byModel = group(rows,"modelo");
const byState = group(rows,"estado");

/* top */
const topModel = Object.entries(byModel).sort((a,b)=>b[1]-a[1])[0] || ["-",0];
const topState = Object.entries(byState).sort((a,b)=>b[1]-a[1])[0] || ["-",0];

let answer = "";

/* lógica da IA */
if(question.includes("receita")){
    answer = `💰 Receita total: R$ ${total.toLocaleString()}
📊 Ticket médio: R$ ${Math.round(avg).toLocaleString()}
👉 Insight: negócio baseado em alto valor por venda`;
}

else if(question.includes("modelo")){
    answer = `🔥 Modelo líder: ${topModel[0]}
👉 Forte concentração nesse produto
🧠 Sugestão: expandir ou escalar`;
}

else if(question.includes("estado") || question.includes("região")){
    answer = `🌎 Estado líder: ${topState[0]}
👉 Concentração regional relevante`;
}

else if(question.includes("o que fazer") || question.includes("estratégia")){
    answer = `🧠 Recomendações estratégicas:

• Focar em ${topModel[0]}
• Expandir atuação fora de ${topState[0]}
• Investir em produtos premium

👉 Baseado no padrão atual de vendas`;
}

else{
    answer = `🤖 Insight geral:

🔥 Produto líder: ${topModel[0]}
🌎 Região dominante: ${topState[0]}
💰 Ticket médio elevado

👉 Negócio com posicionamento premium`;
}

/* resposta */
res.json(answer);

} catch(e){
    console.error("Erro IA LOCAL:", e);
    res.json("Erro interno da IA");
}

});

/* iniciar servidor */
app.listen(3000, () => {
    console.log("✅ Servidor rodando em http://localhost:3000");
});


