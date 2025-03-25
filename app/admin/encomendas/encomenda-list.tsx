'use client'
import { getMoradorNameById } from "@/lib/actions/morador.action";
import { useEffect, useState } from "react";

interface EncomendaListProps {
    moradorId: string;
}

const EncomendaList = ({  moradorId }:     EncomendaListProps ) => {
    const [moradorNome, setMoradorNome] = useState<string | null>(null);

    useEffect(() => {
        const fetchMoradorNome = async () => {
            try {
                const nome = await getMoradorNameById(moradorId);
                setMoradorNome(nome);
            } catch (error) {
                console.error("Erro ao buscar nome do morador:", error);
            }
        };

        fetchMoradorNome();
    }, [moradorId]);

    return (<>
        {moradorNome}
    </>);
}

export default EncomendaList;