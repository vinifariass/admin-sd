export const parkingDefaultValues = {
    apartamento: "",
    placa: "",
    carro: "",
    cor: "",
    nome : "",
    cpf : "",
};

export const moradorDefaultValues = {
    nome: "",
    cpf: "",
    apartamento: "",
    dataLocacao: "",
    dataSaida: "",
    email: "",
    telefone: "",
    tipoMorador: "Proprietário",
};

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;