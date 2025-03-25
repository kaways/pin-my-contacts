import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, LogOut, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface UserActionsDropdownProps {
    email: string;
    onLogout: () => void;
    onDeleteAccount: (password: string) => Promise<boolean>;
}

export const UserActionsDropdown = ({
    email,
    onLogout,
    onDeleteAccount
}: UserActionsDropdownProps) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const success = await onDeleteAccount(password);
        setIsDeleting(false);
        if (success) {
            setIsDeleteDialogOpen(false);
        } else {
            alert('Senha incorreta.');
            return; 
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex gap-2 items-center outline-none">
                    {email.split('@')[0]}
                    <ChevronDown className="h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[180px] p-4">
                    <DropdownMenuItem className='cursor-pointer' onClick={() => setIsDeleteDialogOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir conta
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer' onClick={onLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Sua conta e todos os dados associados serão excluídos.
                        </AlertDialogDescription>
                        <div className="mt-4">
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Digite sua senha"
                            />
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Excluindo...' : 'Confirmar exclusão'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};