function calcular() {
    const area = parseFloat(document.getElementById('area').value);
    const precoLitro = parseFloat(document.getElementById('preco').value) || 0;
    const potencia = parseInt(document.getElementById('trator').value);
    const operacao = document.getElementById('operacao').value;
    const tipoComb = document.getElementById('combustivel').value;

    if (!area || area <= 0) {
        alert("Por favor, informe a área da terra.");
        return;
    }

    // Lógica de Implementos e Eficiência
    let vel, larg, ef;
    if(operacao === 'arar') { 
        vel = 5; 
        larg = potencia * 0.02; 
        ef = 0.75; 
    } else if(operacao === 'plantar') { 
        vel = 7; 
        larg = potencia * 0.04; 
        ef = 0.80; 
    } else { 
        vel = 10; 
        larg = potencia * 0.08; 
        ef = 0.85; 
    }

    // Cálculo de Tempo (Capacidade de Campo)
    const rendimentoHectareHora = (larg * vel * ef) / 10;
    const horasNecessarias = area / rendimentoHectareHora;

    // Cálculo de Combustível
    const consumoBase = (tipoComb === 'diesel') ? 0.22 : 0.30;
    const litrosPorHora = potencia * consumoBase * 0.75; // 75% da potência usada
    const totalLitros = litrosPorHora * horasNecessarias;
    const custoFinanceiro = totalLitros * precoLitro;

    // Atualização da Interface
    const divResultado = document.getElementById('resultado');
    divResultado.style.display = 'block';
    
    document.getElementById('res-tempo').innerText = horasNecessarias.toFixed(1) + " h";
    document.getElementById('res-comb').innerText = totalLitros.toFixed(1) + " L";
    document.getElementById('res-consumo-h').innerText = litrosPorHora.toFixed(1) + " L/h";
    document.getElementById('res-preco').innerText = "R$ " + custoFinanceiro.toLocaleString('pt-BR', {
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2
    });
}