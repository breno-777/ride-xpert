import { IDriver } from "../../interfaces/driver.interface";
import { client } from "./db";
import { handleAddDriver } from "../handles";

const defaultDrivers: IDriver[] = [
    {
        name: "Homer Simpson",
        description: "Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).",
        vehicle: "Plymouth Valiant 1973 rosa e enferrujado",
        review: { rating: 2.5, comment: "Motorista simpático,mas errou o caminho 3vezes. O carro cheira adonuts." },
        tax: 2.50,
        minimum_km: 1,
    },
    {
        name: "Dominic Toretto",
        description: "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.",
        vehicle: "Dodge Charger R/T 1970 modificado",
        review: { rating: 4.5, comment: "Que viagem incrível! Ocarro é um show à partee o motorista, apesar deter uma cara de poucosamigos, foi super genteboa. Recomendo!" },
        tax: 5.00,
        minimum_km: 5,
    },
    {
        name: "James Bond",
        description: "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.",
        vehicle: "Aston Martin DB5 clássico",
        review: { rating: 5.0, comment: "Serviço impecável! Omotorista é a própriadefinição de classe e ocarro é simplesmentemagnífico. Umaexperiência digna deum agente secreto." },
        tax: 10.0,
        minimum_km: 10,
    },
    {
        "name": "Marty McFly",
        "description": "Oi, sou Marty! Pronto para te levar para o futuro... ou talvez só para o seu destino atual. Aperte o cinto e segure o relógio!",
        "vehicle": "DeLorean DMC-12 modificado com um capacitor de fluxo",
        "review": {
            "rating": 4.7,
            "comment": "Viagem rápida e única, mas o motorista pareceu distraído com alguns relâmpagos e datas estranhas. Carro futurista incrível!"
        },
        "tax": 8.50,
        "minimum_km": 5
    },
    {
        "name": "Walter White",
        "description": "Olá, sou Walter White. Vamos ao seu destino com discrição e eficiência. Apenas não faça perguntas desnecessárias.",
        "vehicle": "RV Fleetwood Bounder 1986",
        "review": {
            "rating": 3.8,
            "comment": "Viagem tranquila, mas o veículo parecia um pouco... suspeito. O motorista é calmo, mas tem um olhar intenso."
        },
        "tax": 7.00,
        "minimum_km": 3
    },
    {
        "name": "Batman",
        "description": "Eu sou o Batman. Silencioso, rápido e sempre no controle. O Batmóvel está à sua disposição.",
        "vehicle": "Batmóvel Tumbler",
        "review": {
            "rating": 5.0,
            "comment": "Viagem épica! Motorista misterioso, mas extremamente profissional. O carro parece mais uma nave espacial. Recomendo 100%!"
        },
        "tax": 15.00,
        "minimum_km": 8
    },
    {
        "name": "Scooby-Doo e Salsicha",
        "description": "Ei, eu sou o Salsicha e esse é o Scooby-Doo! Suba na Máquina do Mistério e vamos resolver seus problemas... ou te levar para onde quiser!",
        "vehicle": "Máquina do Mistério",
        "review": {
            "rating": 4.0,
            "comment": "Viagem divertida, mas o motorista parecia com fome o tempo todo. Scooby-Doo é adorável, mas o carro tem cheiro de biscoitos."
        },
        "tax": 3.50,
        "minimum_km": 2
    },
    {
        "name": "Tony Stark",
        "description": "Olá, sou Tony Stark. Você vai viajar com estilo, conforto e talvez um pouco de sarcasmo. Afinal, o que mais esperar de um bilionário?",
        "vehicle": "Audi R8 V10",
        "review": {
            "rating": 4.9,
            "comment": "Motorista estiloso e carismático. O carro é luxuoso e a viagem foi extremamente rápida. Um pouco de ego no ar, mas nada demais."
        },
        "tax": 12.00,
        "minimum_km": 10
    },
    {
        "name": "Doc Brown",
        "description": "Grande Scott! Eu sou o Doc. Vamos viajar no tempo... ou só chegar no horário.",
        "vehicle": "DeLorean DMC-12 (com flux capacitor experimental)",
        "review": {
            "rating": 4.5,
            "comment": "Motorista excêntrico, mas super confiável. Carro incrível, mas teve uns barulhos estranhos na saída."
        },
        "tax": 9.00,
        "minimum_km": 6
    }
];

export const loadDefaultDrivers = async () => {
    try {
        for (const driver of defaultDrivers) {
            const result = await client.query(
                'SELECT id FROM drivers WHERE name = $1',
                [driver.name]
            );
            if (result.rows.length === 0) handleAddDriver(driver);
        }
    } catch (error) {
        console.error('Error injecting default drivers', error);
    }
};