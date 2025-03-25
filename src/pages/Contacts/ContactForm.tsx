import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, ContactFormValues } from '@/types/contact';
import { useCep } from '@/hooks/useCep';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useContacts } from '@/hooks/useContacts';
import { Button } from '@/components/ui/button';
import CpfInputMask from '@/components/ui/cpfInputMask';

interface ContactFormProps {
    onSubmit: (values: ContactFormValues) => void;
    defaultValues?: ContactFormValues | null;
    isSubmitting?: boolean;
    isEdit?: boolean;
    closeOnEditDialog: () => void;
}

export const ContactForm = ({
    onSubmit,
    defaultValues,
    isEdit = false,
    closeOnEditDialog,
}: ContactFormProps) => {
    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: defaultValues || {
            nome: "",
            cpf: "",
            telefone: "",
            cep: "",
            endereco: "",
            numero: "",
            cidade: "",
            estado: "",
            complemento: "",
            latitude: "",
            longitude: "",
        }
    });

    const { handleCepChange } = useCep(form.setValue, form.setError);

    const {
        updateContact,
    } = useContacts();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && defaultValues) {
            updateContact(form.getValues());
            closeOnEditDialog();
        } else
            form.handleSubmit(onSubmit)();
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 py-6">


                    <div className="grid gap-4 grid-cols-2">

                        <div className="grid gap-1 items-center">

                            <FormField
                                control={form.control}
                                name="nome"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <div className="grid gap-1 items-center">
                            <FormField
                                control={form.control}
                                name="cpf"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CPF</FormLabel>
                                        <FormControl>
                                            <CpfInputMask
                                                disabled={isEdit}
                                                {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>


                    <div className="grid gap-1 items-center">


                        <FormField
                            control={form.control}
                            name="telefone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefone</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                field.onChange(value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>


                    <div className="grid gap-1 items-center">

                        <FormField
                            control={form.control}
                            name="cep"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CEP</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                let value = e.target.value;
                                                if (value.length > 5) {
                                                    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
                                                }
                                                field.onChange(value);
                                                handleCepChange(value);
                                            }}
                                            maxLength={9}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>


                    <div className="grid gap-4 grid-cols-2">
                        <div className="grid gap-1 items-center">
                            <FormField
                                control={form.control}
                                name="endereco"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Endereço</FormLabel>
                                        <FormControl>
                                            <Input id="endereco" {...field} className="col-span-3" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid gap-1 items-center">
                            <FormField
                                control={form.control}
                                name="numero"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número</FormLabel>
                                        <FormControl>
                                            <Input id="numero" {...field} className="col-span-3" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 grid-cols-2">
                        <div className="grid gap-1 items-center">
                            <FormField
                                control={form.control}
                                name="cidade"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cidade</FormLabel>
                                        <FormControl>
                                            <Input id="cidade" {...field} className="col-span-3" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid gap-1 items-center">
                            <FormField
                                control={form.control}
                                name="estado"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <FormControl>
                                            <Input id="estado" {...field} className="col-span-3" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid gap-1 items-center">
                        <FormField
                            control={form.control}
                            name="complemento"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Apartamento, bloco, etc</FormLabel>
                                    <FormControl>
                                        <Input id="complemento" {...field} className="col-span-3" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className='flex justify-end'>
                    <Button type="submit"  >
                        {isEdit ? 'Atualizar' : 'Salvar'}
                    </Button>
                </div>
            </form>
        </Form >
    );
};