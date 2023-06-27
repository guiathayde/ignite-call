import { Button, TextInput } from '@ignite-ui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowRight } from 'phosphor-react';

import { From } from './styles';

const claimUsernameFormSchema = z.object({
  username: z.string(),
});

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>;

export function ClaimUsernameForm() {
  const { register, handleSubmit } = useForm<ClaimUsernameFormData>();

  async function handleClaimUsername(data: ClaimUsernameFormData) {}

  return (
    <From as="form" onSubmit={handleSubmit(handleClaimUsername)}>
      <TextInput
        size="sm"
        prefix="ignite.com/"
        placeholder="seu-usuario"
        {...register('username')}
      />
      <Button size="sm" type="submit">
        Reservar
        <ArrowRight />
      </Button>
    </From>
  );
}
