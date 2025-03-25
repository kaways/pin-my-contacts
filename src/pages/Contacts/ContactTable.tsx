import { Contact, ContactFormValues } from '@/types/contact';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ArrowUpDown, Trash2, Pencil } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ContactTableProps {
    contacts: Contact[];
    onEdit: (contact: ContactFormValues) => void;
    onDelete: (cpf: string) => void;
    onRowClick: (lat: number, lng: number) => void;
    onSort: () => void;
    onNameFilterChange: (value: string) => void;
    onCpfFilterChange: (value: string) => void;
}

export const ContactTable = ({
    contacts,
    onEdit,
    onDelete,
    onRowClick,
    onSort,
    onNameFilterChange,
    onCpfFilterChange
}: ContactTableProps) => {
    return (
        <div className="flex flex-col w-full gap-5">
            <div className="flex gap-5">
                <Input
                    placeholder="Busca por nome..."
                    onChange={(e) => onNameFilterChange(e.target.value)}
                />
                <Input
                    placeholder="Busca por cpf..."
                    onChange={(e) => onCpfFilterChange(e.target.value)}
                />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] flex items-center cursor-pointer" onClick={onSort}>
                            Nome
                            <ArrowUpDown className="h-4 ml-2" />
                        </TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead className="text-right">CEP</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contacts.map((contact) => (
                        <TableRow
                            key={contact.cpf}
                            onClick={() => onRowClick(Number(contact.latitude), Number(contact.longitude))}
                            className="cursor-pointer"
                        >
                            <TableCell className="font-medium">{contact.nome}</TableCell>
                            <TableCell>{contact.cpf}</TableCell>
                            <TableCell>{contact.telefone}</TableCell>
                            <TableCell className="text-right">{contact.cep}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[110px] p-2">
                                        <DropdownMenuItem
                                            className="flex gap-4 cursor-pointer"
                                            onClick={() => onEdit(contact)}
                                        >
                                            <Pencil />
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className='flex gap-4 cursor-pointer'
                                            onClick={() => onDelete(contact.cpf)}
                                        >
                                            <Trash2 />
                                            Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};