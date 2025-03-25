export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Condominio Santos Dumont";

export const signInDefaultValues = {
    email: '',
    password: ''
}

export const signUpDefaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
}

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
    email: "" ,
    telefone: "",
    tipoMorador: "Proprietário",
};


export const funcionarioDefaultValues = {
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    
};

export const encomendaDefaultValues = {
    numeroPedido: "",
    moradorId: "",
}
     

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;