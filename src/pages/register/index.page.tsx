import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react';
import { z } from 'zod';
import { NextSeo } from 'next-seo';
import { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { ArrowRight } from 'phosphor-react';

import { api } from '@/lib/axios';

import { Container, Header, Form, FormError } from './styles';

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' })
    .regex(/^([a-z\\-]+)$/i, { message: 'O usuário pode ter letras e hifens.' })
    .transform((username) => username.toLowerCase()),

  name: z
    .string()
    .min(3, { message: 'O nome precisa ter pelo menos 3 letras.' }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  });
  const router = useRouter();

  useEffect(() => {
    if (router.query?.username) {
      setValue('username', String(router.query.username));
    }
  }, [router.query?.username, setValue]);

  async function handleRegister({ name, username }: RegisterFormData) {
    try {
      await api.post('/users', {
        name,
        username,
      });

      await router.push('/register/connect-calendar');
    } catch (error) {
      console.error(error);

      if (error instanceof AxiosError && error?.response?.data?.message) {
        alert(error.response.data.message);
      }
    }
  }

  return (
    <>
      <NextSeo title="Crie uma conta | Ignite Call" />

      <Container>
        <Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>

          <MultiStep size={4} currentStep={1} />
        </Header>

        <Form as="form" onSubmit={handleSubmit(handleRegister)}>
          <label>
            <Text size="sm">Nome de usuário</Text>
            <TextInput
              prefix="ignite.com/"
              placeholder="seu-usuario"
              {...register('username')}
            />

            {errors.username ? (
              <FormError size="sm">{errors.username.message}</FormError>
            ) : null}
          </label>

          <label>
            <Text size="sm">Nome completo</Text>
            <TextInput placeholder="Seu nome" {...register('name')} />

            {errors.name ? (
              <FormError size="sm">{errors.name.message}</FormError>
            ) : null}
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  );
}
