function calcular() {

    const area = parseFloat(document.getElementById('area').value);
    const precoLitro = parseFloat(document.getElementById('preco').value);
    const potencia = parseInt(document.getElementById('trator').value);
    const operacao = document.getElementById('operacao').value;
    const tipoComb = document.getElementById('combustivel').value;

    // Validação
    if (isNaN(area) || area <= 0) {
        alert("Informe uma área válida.");
        return;
    }

    if (isNaN(precoLitro) || precoLitro <= 0) {
        alert("Informe o preço do combustível.");
        return;
    }

    // Parâmetros
    let vel, larg, ef;

    if (operacao === 'arar') {
        vel = 5;
        larg = potencia * 0.02;
        ef = 0.75;
    } else if (operacao === 'plantar') {
        vel = 7;
        larg = potencia * 0.04;
        ef = 0.80;
    } else {
        vel = 10;
        larg = potencia * 0.08;
        ef = 0.85;
    }

    const rendimento = (larg * vel * ef) / 10;

    if (rendimento <= 0) {
        alert("Erro no cálculo.");
        return;
    }

    const horas = area / rendimento;

    const consumoBase = (tipoComb === 'diesel') ? 0.22 : 0.30;
    const litrosHora = potencia * consumoBase * 0.75;
    const totalLitros = litrosHora * horas;
    const custo = totalLitros * precoLitro;

    // Mostrar resultado
    document.getElementById('resultado').style.display = 'block';

    document.getElementById('res-tempo').innerText = horas.toFixed(1) + " h";
    document.getElementById('res-comb').innerText = totalLitros.toFixed(1) + " L";
    document.getElementById('res-consumo-h').innerText = litrosHora.toFixed(1) + " L/h";
    document.getElementById('res-preco').innerText = custo.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}