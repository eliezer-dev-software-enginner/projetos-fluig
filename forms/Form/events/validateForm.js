function validateForm(form) {
	var erros = [];

	// 1. Campos obrigatórios
	var obrigatorios = [
		{ campo: "nomeFuncionario", label: "Nome do funcionário" },
		{ campo: "matricula",       label: "Matrícula" },
		{ campo: "departamento",    label: "Departamento" },
		{ campo: "centroCusto",     label: "Centro de custo" },
		{ campo: "cidadeDestino",   label: "Cidade de destino" },
		{ campo: "motivoViagem",    label: "Motivo da viagem" },
		{ campo: "dataEntrada",     label: "Data de entrada" },
		{ campo: "dataSaida",       label: "Data de saída" },
		{ campo: "qtdHospedes",     label: "Quantidade de hóspedes" },
		{ campo: "valorDiaria",     label: "Valor estimado da diária" }
	];

	for (var i = 0; i < obrigatorios.length; i++) {
		if (vazio(form.getValue(obrigatorios[i].campo))) {
			erros.push("O campo \"" + obrigatorios[i].label + "\" é obrigatório.");
		}
	}

	// 2. Data de saída posterior à data de entrada
	var dataEntrada = converterData(form.getValue("dataEntrada"));
	var dataSaida = converterData(form.getValue("dataSaida"));

	if (!vazio(form.getValue("dataEntrada")) && dataEntrada == null) {
		erros.push("A \"Data de entrada\" é inválida.");
	}
	if (!vazio(form.getValue("dataSaida")) && dataSaida == null) {
		erros.push("A \"Data de saída\" é inválida.");
	}
	if (dataEntrada != null && dataSaida != null && dataSaida.getTime() <= dataEntrada.getTime()) {
		erros.push("A \"Data de saída\" deve ser posterior à \"Data de entrada\".");
	}

	// 3. Quantidade de hóspedes maior que zero
	var qtdHospedes = form.getValue("qtdHospedes");
	if (!vazio(qtdHospedes)) {
		var hospedes = Number(String(qtdHospedes).trim());
		if (isNaN(hospedes) || hospedes <= 0 || Math.floor(hospedes) != hospedes) {
			erros.push("A \"Quantidade de hóspedes\" deve ser um número inteiro maior que zero.");
		}
	}

	// Valor da diária precisa ser um valor monetário válido e positivo
	var valorDiaria = form.getValue("valorDiaria");
	if (!vazio(valorDiaria)) {
		var valor = converterMoeda(valorDiaria);
		if (valor == null || valor <= 0) {
			erros.push("O \"Valor estimado da diária\" deve ser um valor maior que zero.");
		}
	}

	if (erros.length > 0) {
		throw "\n" + erros.join("\n");
	}
}

function vazio(valor) {
	return valor == null || String(valor).trim() == "";
}

// Aceita "yyyy-MM-dd" (input date) ou "dd/MM/yyyy"
function converterData(valor) {
	if (vazio(valor)) return null;
	valor = String(valor).trim();

	var partes, dia, mes, ano;
	if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
		partes = valor.split("-");
		ano = parseInt(partes[0], 10);
		mes = parseInt(partes[1], 10);
		dia = parseInt(partes[2], 10);
	} else if (/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
		partes = valor.split("/");
		dia = parseInt(partes[0], 10);
		mes = parseInt(partes[1], 10);
		ano = parseInt(partes[2], 10);
	} else {
		return null;
	}

	var data = new Date(ano, mes - 1, dia);
	if (data.getFullYear() != ano || data.getMonth() != mes - 1 || data.getDate() != dia) {
		return null;
	}
	return data;
}

// Aceita "1.234,56", "1234,56" ou "1234.56"
function converterMoeda(valor) {
	var texto = String(valor).replace(/R\$/g, "").replace(/\s/g, "");
	if (texto.indexOf(",") >= 0) {
		texto = texto.replace(/\./g, "").replace(",", ".");
	}
	if (!/^\d+(\.\d{1,2})?$/.test(texto)) return null;
	return parseFloat(texto);
}
