import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { authService } from "@/services/auth";
import { customerService } from "@/services/customer";
import { translateSupabaseError } from "@/utils/errorMessages";
import type { SignUpData } from "@/services/auth";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<SignUpData>();

  const onSubmit = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      const { user } = await authService.signUp(data);
      if (user) {
        await customerService.syncWithSupabase(user.id, data.name);
        toast.success("Conta criada com sucesso!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(translateSupabaseError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
      <div className="w-full rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold">Criar conta</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Nome
            </label>
            <input
              id="name"
              type="text"
              {...register("name", { required: true })}
              className="w-full rounded-lg border px-4 py-2 text-sm"
              placeholder="Seu nome completo"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              {...register("email", { required: true })}
              className="w-full rounded-lg border px-4 py-2 text-sm"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="w-full rounded-lg border px-4 py-2 text-sm"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Mínimo de 6 caracteres
            </p>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link to="/login" className="font-semibold text-primary">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};

