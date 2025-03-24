import React from 'react';
import { Input } from "@/components/ui/input"

interface CpfInputProps {
    value: string;
    onChange: (value: string) => void;
}

const CpfInputMask: React.FC<CpfInputProps> = ({ value, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let cpf = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o primeiro ponto
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o segundo ponto
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o traço
        onChange(cpf);
    };

    return (
        <Input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Digite seu CPF"
            maxLength={14}
        />
    );
};

export default CpfInputMask;