const TRATORES = Object.freeze({
    "New Holland TL5.100": { potencia: 101, consumo_base: 10.1 },
    "New Holland T5.110": { potencia: 110, consumo_base: 11.0 },
    "Case IH Farmall 130": { potencia: 132, consumo_base: 13.2 },
    "John Deere 6135M": { potencia: 135, consumo_base: 13.5 },
    "John Deere 7M 230": { potencia: 230, consumo_base: 23.0 },
    "Case IH Puma 230": { potencia: 234, consumo_base: 23.4 },
    "New Holland T7.240": { potencia: 234, consumo_base: 23.4 },
    "John Deere 8R 340": { potencia: 340, consumo_base: 34.0 },
    "Case IH Magnum 340": { potencia: 340, consumo_base: 34.0 },
    "New Holland T8.385": { potencia: 340, consumo_base: 34.0 }
});

const PLANTADEIRAS = Object.freeze({
    "NH PL6000 (11L)": { linhas: 11, insumo: "Semente + Adubo", velocidade: 6.5, eficiencia: 0.65 },
    "Case Easy Riser 3200 (13L)": { linhas: 13, insumo: "Semente + Adubo", velocidade: 6.5, eficiencia: 0.65 },
    "JD Série 1100 (13L)": { linhas: 13, insumo: "Semente + Adubo", velocidade: 6.5, eficiencia: 0.65 },
    "NH PL6000 (17L)": { linhas: 17, insumo: "Semente + Adubo", velocidade: 7.0, eficiencia: 0.70 },
    "JD PL1200 (18L)": { linhas: 18, insumo: "Semente + Adubo", velocidade: 7.5, eficiencia: 0.70 },
    "Case Easy Riser 3200 (19L)": { linhas: 19, insumo: "Semente + Adubo", velocidade: 6.5, eficiencia: 0.65 },
    "NH PL7000 (36L)": { linhas: 36, insumo: "Apenas Semente", velocidade: 9.5, eficiencia: 0.80 },
    "JD DB40 (40L)": { linhas: 40, insumo: "Apenas Semente", velocidade: 10.0, eficiencia: 0.85 },
    "Case Fast Riser 6100 (40L)": { linhas: 40, insumo: "Apenas Semente", velocidade: 10.0, eficiencia: 0.85 }
});

const CULTURAS = Object.freeze(["Soja", "Feijão", "Milho"]);

function normalizarTexto(texto) {
    return String(texto || "").trim().toLowerCase();
}

function buscarTrator(tratorNome) {
    const nome = Object.keys(TRATORES).find((nomeEquipamento) => normalizarTexto(nomeEquipamento) === normalizarTexto(tratorNome));
    if (!nome) {
        return null;
    }

    return { nome, ...TRATORES[nome] };
}

function buscarPlantadeira(plantadeiraNome) {
    const nome = Object.keys(PLANTADEIRAS).find((nomeEquipamento) => normalizarTexto(nomeEquipamento) === normalizarTexto(plantadeiraNome));
    if (!nome) {
        return null;
    }

    return { nome, ...PLANTADEIRAS[nome] };
}

function obterPotenciaNecessaria(plantadeira) {
    // A potência mínima é função do tipo de operação e da quantidade de linhas.
    return plantadeira.linhas * (plantadeira.insumo === "Semente + Adubo" ? 13 : 8);
}

function obterAdicionalPorLinha(cultura, plantadeira) {
    // O consumo cresce com a demanda do sistema de plantio e com a complexidade da operação.
    if (cultura === "Soja" || cultura === "Feijão") {
        return plantadeira.insumo === "Semente + Adubo" ? 0.80 : 0.50;
    }

    if (cultura === "Milho") {
        return plantadeira.insumo === "Semente + Adubo" ? 0.92 : 0.50;
    }

    return 0;
}

function calcular_simulacao(trator_nome, plantadeira_nome, cultura) {
    const trator = buscarTrator(trator_nome);
    const plantadeira = buscarPlantadeira(plantadeira_nome);
    const culturaNormalizada = cultura ? cultura.trim() : "";

    if (!trator || !plantadeira) {
        return {
            ok: false,
            erro: "Trator ou plantadeira não encontrados. Verifique os nomes informados.",
            trator_nome,
            plantadeira_nome,
            cultura: culturaNormalizada
        };
    }

    if (!CULTURAS.includes(culturaNormalizada)) {
        return {
            ok: false,
            erro: "Cultura inválida. Escolha entre Soja, Feijão ou Milho.",
            trator_nome,
            plantadeira_nome,
            cultura: culturaNormalizada
        };
    }

    const potencia_necessaria = obterPotenciaNecessaria(plantadeira);
    const adicional_por_linha = obterAdicionalPorLinha(culturaNormalizada, plantadeira);
    const consumo_horario_total = trator.consumo_base + (plantadeira.linhas * adicional_por_linha);
    const largura_trabalho = plantadeira.linhas * 0.45;
    const cot = (largura_trabalho * plantadeira.velocidade) / 10;
    const coe = cot * plantadeira.eficiencia;
    const consumo_por_hectare = consumo_horario_total / coe;
    const alertas = [];

    if (trator.potencia < potencia_necessaria) {
        alertas.push("![⚠️](https://fonts.gstatic.com/s/e/notoemoji/17.0/26a0_fe0f/32.png) Alerta: Trator subdimensionado! Potência insuficiente para a operação ideal.");
    }

    return {
        ok: true,
        trator: trator.nome,
        plantadeira: plantadeira.nome,
        cultura: culturaNormalizada,
        potencia_trator: trator.potencia,
        potencia_necessaria,
        subdimensionado: trator.potencia < potencia_necessaria,
        alertas,
        insumo: plantadeira.insumo,
        linhas: plantadeira.linhas,
        velocidade: plantadeira.velocidade,
        eficiencia: plantadeira.eficiencia,
        consumo_horario_total: Number(consumo_horario_total.toFixed(2)),
        largura_trabalho: Number(largura_trabalho.toFixed(2)),
        cot: Number(cot.toFixed(2)),
        coe: Number(coe.toFixed(2)),
        consumo_por_hectare: Number(consumo_por_hectare.toFixed(2))
    };
}

function preencherSeletores() {
    const tratorSelect = document.getElementById("tratorSelect");
    const plantadeiraSelect = document.getElementById("plantadeiraSelect");

    if (!tratorSelect || !plantadeiraSelect) {
        return;
    }

    Object.keys(TRATORES).forEach((nome) => {
        const option = document.createElement("option");
        option.value = nome;
        option.textContent = nome;
        tratorSelect.appendChild(option);
    });

    Object.keys(PLANTADEIRAS).forEach((nome) => {
        const option = document.createElement("option");
        option.value = nome;
        option.textContent = nome;
        plantadeiraSelect.appendChild(option);
    });
}

function formatarValor(valor) {
    return Number(valor).toFixed(2).replace(".", ",");
}

function renderizarRelatorio(relatorio) {
    const container = document.getElementById("resultadoSimulacao");
    const exemploContainer = document.getElementById("exemploResultado");

    if (!container) {
        return;
    }

    if (!relatorio.ok) {
        container.innerHTML = `<p class="erro">${relatorio.erro}</p>`;
        return;
    }

    const alertasHtml = relatorio.alertas.length
        ? `<div class="alerta">${relatorio.alertas.join("<br>")}</div>`
        : "";

    container.innerHTML = `
        <div class="resumo">
            <h3>Relatório da simulação</h3>
            <p><strong>Trator:</strong> ${relatorio.trator}</p>
            <p><strong>Plantadeira:</strong> ${relatorio.plantadeira}</p>
            <p><strong>Cultura:</strong> ${relatorio.cultura}</p>
            <p><strong>Insumo:</strong> ${relatorio.insumo}</p>
        </div>
        <ul>
            <li><strong>Potência do trator:</strong> ${relatorio.potencia_trator} cv</li>
            <li><strong>Potência necessária:</strong> ${relatorio.potencia_necessaria} cv</li>
            <li><strong>Linhas:</strong> ${relatorio.linhas}</li>
            <li><strong>Consumo horário total:</strong> ${formatarValor(relatorio.consumo_horario_total)} L/h</li>
            <li><strong>Largura de trabalho:</strong> ${formatarValor(relatorio.largura_trabalho)} m</li>
            <li><strong>COT:</strong> ${formatarValor(relatorio.cot)} ha/h</li>
            <li><strong>COE:</strong> ${formatarValor(relatorio.coe)} ha/h</li>
            <li><strong>Consumo por hectare:</strong> ${formatarValor(relatorio.consumo_por_hectare)} L/ha</li>
        </ul>
        ${alertasHtml}
    `;

    if (exemploContainer) {
        exemploContainer.textContent = JSON.stringify(relatorio, null, 2);
    }
}

function calcular() {
    const tratorNome = document.getElementById("tratorSelect")?.value;
    const plantadeiraNome = document.getElementById("plantadeiraSelect")?.value;
    const cultura = document.getElementById("culturaSelect")?.value;

    const relatorio = calcular_simulacao(tratorNome, plantadeiraNome, cultura);
    renderizarRelatorio(relatorio);
}

function inicializarSimulador() {
    preencherSeletores();

    const botao = document.getElementById("btnCalcular");
    if (botao) {
        botao.addEventListener("click", calcular);
    }

    const relatorioExemplo = calcular_simulacao("New Holland T5.110", "Case Easy Riser 3200 (13L)", "Milho");
    renderizarRelatorio(relatorioExemplo);
}

if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", inicializarSimulador);
}

if (typeof module !== "undefined") {
    module.exports = {
        TRATORES,
        PLANTADEIRAS,
        CULTURAS,
        calcular_simulacao,
        buscarTrator,
        buscarPlantadeira,
        obterPotenciaNecessaria,
        obterAdicionalPorLinha
    };
}