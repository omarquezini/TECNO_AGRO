let grafico;

function converterArea(area, unidade) {
    const fatores = {
        "alqueire_sp": 2.42,
        "hectare": 1
    };
    return area * (fatores[unidade] || 1);
}

function calcular() {
    const areaInput = document.getElementById("area").value;
    const precoInput = document.getElementById("preco").value;
    const unidade = document.getElementById("unidade").value;
    const potencia = parseInt(document.getElementById("trator").value);
    const operacao = document.getElementById("operacao").value;
    const combustivel = document.getElementById("combustivel").value;

    if (!areaInput || !precoInput) {
        document.getElementById("erro").innerText = "Por favor, preencha todos os campos!";
        return;
    }

    const area = parseFloat(areaInput);
    const preco = parseFloat(precoInput);
    document.getElementById("erro").innerText = "";

    const areaHectare = converterArea(area, unidade);

    // Configurações de rendimento por operação
   // const config = {
   //     arar: { vel: 5, fator: 0.02, ef: 0.75 },
   //     plantar: { vel: 7, fator: 0.04, ef: 0.80 },
   //     irrigar: { vel: 10, fator: 0.08, ef: 0.85 }
 //   };

    const op = config[operacao];
    const largura = potencia * op.fator;
    const rendimento = (largura * op.vel * op.ef) / 10; // ha/h

    const horas = areaHectare / rendimento;
    const consumoBase = combustivel === 'diesel' ? 0.22 : 0.30;
    const consumoHora = potencia * consumoBase * 0.75;

    const totalLitros = consumoHora * horas;
    const custo = totalLitros * preco;

    // Atualização da Interface
    exibirResultados(areaHectare, horas, totalLitros, consumoHora, custo);
    criarGrafico(totalLitros, custo);
}

function exibirResultados(area, horas, litros, consumo, custo) {
    document.getElementById("resultado").style.display = "block";
    document.getElementById("areaConv").innerText = area.toFixed(2) + " ha";
    document.getElementById("tempo").innerText = horas.toFixed(1) + " h";
    document.getElementById("comb").innerText = litros.toFixed(1) + " L";
    document.getElementById("consumo").innerText = consumo.toFixed(1) + " L/h";
    document.getElementById("precoTotal").innerText = custo.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function criarGrafico(litros, custo) {
    const ctx = document.getElementById("grafico").getContext("2d");

    if (grafico) grafico.destroy();

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(46, 125, 50, 0.4)");
    gradient.addColorStop(1, "rgba(46, 125, 50, 0)");

    grafico = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Início", "Combustível (L)", "Custo (R$)"],
            datasets: [{
                label: "Escala da Operação",
                data: [0, litros, custo],
                borderColor: "#2e7d32",
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: "#ffffff",
                pointRadius: 5,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: "#2e7d32", font: { weight: "bold" } } }
            }
        }
    });
}