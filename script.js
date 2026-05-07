let grafico;

// Agora usando o ID do botão corretamente
document.getElementById("btnCalcular").addEventListener("click", calcular);

function calcular() {
    const unidade = document.getElementById("unidade").value;
    const area = parseFloat(document.getElementById("area").value);
    const preco = parseFloat(document.getElementById("preco").value);
    const trator = parseFloat(document.getElementById("trator").value);
    const operacao = document.getElementById("operacao").value;
    const combustivel = document.getElementById("combustivel").value;

    const erro = document.getElementById("erro");

    erro.textContent = "";

    if (!area || !preco) {
        erro.textContent = "Preencha todos os campos corretamente!";
        return;
    }

    // Conversão de área
    let areaHa = unidade === "alqueire_sp" ? area * 2.42 : area;

    // Consumo base por tipo de trator (simulação)
    let consumoHora = trator * 1.8;

    // Ajuste por combustível
    if (combustivel === "gasolina") {
        consumoHora *= 10.5;
    }

    // Tempo estimado (hectares por hora fictício)
    let rendimento = 7; // ha/h
    let tempo = areaHa / rendimento;

    // Combustível total
    let combustivelTotal = consumoHora * tempo;

    // Custo
    let custoTotal = combustivelTotal * preco;

    // Exibir resultados
    document.getElementById("areaConv").textContent = areaHa.toFixed(2) + " ha";
    document.getElementById("tempo").textContent = tempo.toFixed(2) + " horas";
    document.getElementById("comb").textContent = combustivelTotal.toFixed(2) + " L";
    document.getElementById("consumo").textContent = consumoHora.toFixed(2) + " L/h";
    document.getElementById("precoTotal").textContent = "R$ " + custoTotal.toFixed(2);

    document.getElementById("resultado").style.display = "block";

    gerarGrafico(consumoHora, combustivelTotal, custoTotal);
}

function gerarGrafico(consumo, total, custo) {
    const ctx = document.getElementById("grafico").getContext("2d");

    if (grafico) {
        grafico.destroy();
    }

    grafico = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Consumo/h", "Total Combustível", "Custo"],
            datasets: [{
                label: "Dados da Operação",
                data: [consumo, total, custo],
                backgroundColor: [
                    "#66bb6a",
                    "#ffa726",
                    "#ef5350"
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}