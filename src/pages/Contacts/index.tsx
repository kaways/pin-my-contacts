
import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormLabel,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axios from 'axios';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, MoreHorizontal, Pencil, Trash2, ArrowUpDown } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import CpfInputMask from "@/components/ui/cpfInputMask"
import { AuthContext } from "@/context/AuthContext"

export function Contacts() {
    const API_KEY = "AIzaSyC-E5Dgt_ihYpZQulR53HehuJUzHrpSmDk";
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '[]');
    const UsersCurrent = `users-${currentUser?.email}`;
    const [users, setUsers] = useState<z.infer<typeof formSchema>[]>([]);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isModalEdit, setModalEdit] = useState(false);
    const [latActive, setLatActive] = useState(Number);
    const [lngActive, setLngActive] = useState(Number);
    const navigate = useNavigate();
    const { logout } = React.useContext(AuthContext)!;
    const { loadError, isLoaded } = useLoadScript({
        googleMapsApiKey: API_KEY,
    });

    const sortedUsers = [...users].sort((a, b) =>
        sortDirection === "asc" ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome)
    );

    const mapContainerStyle = {
        width: '100%',
        height: '400px',
    };

    // Coordenadas iniciais (ex: São Paulo, Brasil)
    const center = {
        lat: latActive || -23.5505,
        lng: lngActive || -46.6333,
    };

    useEffect(() => {
        // localStorage.clear()

        setUsers(JSON.parse(localStorage.getItem(UsersCurrent) || '[]'));
        console.log(JSON.parse(localStorage.getItem(UsersCurrent) || '[]'))
    }, [UsersCurrent]);

    const formSchema = z.object({
        nome: z.string().min(1, {
            message: "Campo obrigatório",
        }),
        cpf: z.string().min(1, {
            message: "Campo obrigatório",
        }),
        telefone: z.string().min(1, {
            message: "Campo obrigatório",
        }),
        cep: z.string().min(1, {
            message: "Campo obrigatório",
        }),
        endereco: z.string().min(1, {
            message: "Campo obrigatório",
        }),
        numero: z.string().min(1, {
            message: "Campo obrigatório",
        }),
        cidade: z.string().min(1, {
            message: "Campo obrigatório",
        }),
        estado: z.string().min(1, {
            message: "Campo obrigatório",
        }),
        complemento: z.string().min(0),
        latitude: z.string().min(0),
        longitude: z.string().min(0),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
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
        },
    })

    const handleChangeCep = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const cep = e.target.value;
        try {
            // Remove caracteres não numéricos do CEP
            const cepNumerico = cep.replace(/\D/g, '');

            // Verifica se o CEP tem 8 dígitos
            if (cepNumerico.length !== 8) {
                return;
            }

            const response = await axios.get(`https://viacep.com.br/ws/${cepNumerico}/json/`);

            // Verifica se o CEP foi encontrado
            if (response.data.erro) {
                form.setError('cep', { message: 'CEP não encontrado' });
            } else {
                // Preenche os campos do formulário com os dados retornados
                form.setValue('endereco', response.data.logradouro);
                form.setValue('cidade', response.data.localidade);
                form.setValue('estado', response.data.uf);
                form.clearErrors('cep'); // Limpa o erro do CEP, se houver
            }
        } catch (err) {
            console.log('Erro ao consultar o CEP', err);
            form.setError('cep', { message: 'Erro ao consultar o CEP' });
        }
    }

    const geocodeAddress = async (address: string) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
            );

            if (response.data.status === 'OK') {
                const location = response.data.results[0].geometry.location;
                return {
                    lat: location.lat,
                    lng: location.lng,
                };
            } else {
                throw new Error('Endereço não encontrado');
            }
        } catch (error) {
            console.error('Erro ao geocodificar endereço:', error);
            throw error;
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const { lat, lng } = await geocodeAddress(`${values.endereco}, ${values.numero}, ${values.cidade}, ${values.estado}`);

        values = {
            ...values,
            latitude: lat,
            longitude: lng,
        };

        const users = JSON.parse(localStorage.getItem(UsersCurrent) || '[]');

        if (isModalEdit) {
            const selectesUser = users.findIndex((u: { cpf: string }) => u.cpf === values.cpf);
            users[selectesUser] = { ...users[selectesUser], ...values };

            localStorage.setItem(UsersCurrent, JSON.stringify(users));
            setUsers(users);
            setIsDialogOpen(false);
        } else {
            const emailExists = users.some((u: { cpf: string }) => u.cpf === values.cpf);
            if (emailExists) {
                alert('Este CPF já está cadastrado.');
                return;
            }

            console.log(values);

            users.push(values);
            localStorage.setItem(UsersCurrent, JSON.stringify(users));
            setUsers(users);
            setIsDialogOpen(false);
        }
    }

    const handleRowClick = (lat: number, lng: number) => {
        setLatActive(lat);
        setLngActive(lng)
    };

    const handleEdit = (user: z.infer<typeof formSchema>) => {
        form.setValue('nome', user.nome);
        form.setValue('cpf', user.cpf);
        form.setValue('telefone', user.telefone);
        form.setValue('cep', user.cep);
        form.setValue('endereco', user.endereco);
        form.setValue('numero', user.numero);
        form.setValue('cidade', user.cidade);
        form.setValue('estado', user.estado);
        form.setValue('complemento', user.complemento);
        setIsDialogOpen(true);
        setModalEdit(true);
    }

    const handleRemove = (user: z.infer<typeof formSchema>) => {
        const users = (JSON.parse(localStorage.getItem(UsersCurrent) || '[]'));

        const updatedUsers = users.filter((u: { cpf: string }) => u.cpf !== user.cpf);
        localStorage.setItem(UsersCurrent, JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    const openDialog = () => {
        setIsDialogOpen(!isDialogOpen);
        setModalEdit(false);
        form.reset();
    }

    const toggleSortDirection = () => {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    {
        if (loadError) <div>Erro ao carregar o mapa</div>
        if (!isLoaded) return <div>Carregando mapa...</div>;
    }


    return (
        <div className="mx-auto h-screen flex flex-col p-8 pl-16 pr-16 gap-10 bg-[#F5F5F5]">
            <div className='w-full flex justify-between'>
                <h2>Tela de Contatos</h2>

                <Button onClick={() => { handleLogout() }}>Sair</Button>
            </div>

            <div className="flex gap-10">
                <div className="flex flex-col gap-5 w-1/2 p-16 rounded-xl bg-[#FFFFFF] items-end">

                    <Dialog open={isDialogOpen} onOpenChange={openDialog}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-[120px]">
                                Adicionar
                                <Plus />
                            </Button>

                        </DialogTrigger>
                        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="w-2xl p-6 py-6 pl-12 pr-12">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <DialogHeader>
                                        <DialogTitle>Adicionar contato</DialogTitle>
                                    </DialogHeader>
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
                                                                <Input id="nome" {...field} className="col-span-3" />
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
                                                                <CpfInputMask {...field} />
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
                                                                id="telefone"
                                                                {...field}
                                                                onChange={(e) => {
                                                                    const value = e.target.value.replace(/\D/g, '');
                                                                    field.onChange(value);
                                                                }}
                                                                className="col-span-3"
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
                                                                id="CEP"
                                                                {...field}
                                                                onChange={(e) => {
                                                                    let value = e.target.value;
                                                                    if (value.length > 5)
                                                                        value = value.replace(/^(\d{5})(\d)/, '$1-$2'); // Adiciona o traço

                                                                    field.onChange(value); // Atualiza o valor do campo no formulário
                                                                    handleChangeCep(e); // Consulta o CEP
                                                                }}
                                                                maxLength={9}
                                                                className="col-span-3" />
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
                                    <DialogFooter>
                                        <Button type="submit">{!isModalEdit ? 'Salvar' : 'Atualizar'}</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>

                    <div className='flex flex-col w-full gap-5'>
                        <Input
                            placeholder="Filter emails..."
                        />
                        <Table>
                            <TableCaption>Lista da contatos.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px] flex items-center" onClick={toggleSortDirection}>
                                        Nome
                                        < ArrowUpDown className='h-4' />
                                    </TableHead>
                                    <TableHead>CPF</TableHead>
                                    <TableHead>Telefone</TableHead>
                                    <TableHead className="text-right">CEP</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedUsers?.map((user, index) => (
                                    <TableRow key={index} onClick={() => handleRowClick(Number(user.latitude), Number(user.longitude))} >
                                        <TableCell className="font-medium">{user.nome}</TableCell>
                                        <TableCell>{user.cpf}</TableCell>
                                        <TableCell>{user.telefone}</TableCell>
                                        <TableCell className="text-right">{user.cep}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        className="flex justify-between cursor-pointer"
                                                        onClick={() => handleEdit(user)}
                                                    >
                                                        Editar
                                                        <Pencil />
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className='cursor-pointer'
                                                        onClick={() => handleRemove(user)}
                                                    >
                                                        Excluir
                                                        <Trash2 />
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                </div>

                <div className="flex w-1/2 p-16 rounded-xl justify-center items-center bg-[#FFFFFF]">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={12} // Nível de zoom inicial
                        center={center} // Coordenadas iniciais
                    >
                        {/* Marcador no mapa */}
                        <Marker position={center} />
                    </GoogleMap>
                </div>
            </div>

        </div>
    )
}

export default Contacts
