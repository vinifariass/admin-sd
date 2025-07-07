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
    nome: "",
    cpf: "",
};

export const moradorDefaultValues = {
    nome: "",
    cpf: "",
    apartamento: "",
    usuarioId: null,
    dataLocacao: null,
    dataSaida: null,
    email: null,
    telefone: null,
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

export const agendamentoDefaultValues = {
    nome: "",
    horario: "",
    status: "",
}

export const servicoDefaultValues = {
    nomeServico: "",
    dataVencimento: "",
}

export const gastoDefaultValues = {
    descricao: "",
    valor: 0,
    data: undefined as Date | undefined,
}

export const visitanteDefaultValues = {
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    apartamento: "",
    dataVisita: undefined as Date | undefined,
    horario: "",
    status: "AGENDADO",
    observacoes: "",
    autorizado: false,
    autorizadoPor: "",
}

export const notificacaoDefaultValues = {
    titulo: "",
    mensagem: "",
    tipo: "INFO" as 'INFO' | 'AVISO' | 'URGENTE',
    remetente: "",
    destinatario: "",
    lida: false,
}

export const boletoDefaultValues = {
    numeroBoleto: "",
    codigoBarras: "",
    apartamento: "",
    moradorId: undefined,
    valor: 0,
    dataVencimento: null,
    dataPagamento: null,
    pago: false,
    observacoes: "",
}

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const USER_ROLES = process.env.USER_ROLES ? process.env.USER_ROLES.split(', ') : ['MORADOR', 'FUNCIONARIO', 'ADMIN'];
