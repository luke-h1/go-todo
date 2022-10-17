import { useState } from "react";
import { useForm } from "@mantine/hooks";
import { Button, Group, Modal, Textarea, TextInput } from "@mantine/core";
import { SERVER_URL, Todo } from "../App";
import { KeyedMutator } from "swr";

interface Props {
  mutate: KeyedMutator<Todo[]>;
}

const AddTodo = ({ mutate }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      title: "",
      body: "",
    },
  });

  async function createTodo(values: { title: string; body: string }) {
    const updated = await fetch(`${SERVER_URL}/api/todos`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    mutate(updated);
    form.reset();
    setOpen(false);
  }

  return (
    <>
      <Modal opened={open} onClose={() => setOpen(false)} title="Create todo">
        <form onSubmit={form.onSubmit(createTodo)}>
          <TextInput
            required
            mb={12}
            label="Todo"
            placeholder="What do you want to do?"
            {...form.getInputProps("title")}
          />
          <Textarea
            required
            mb={12}
            label="Body"
            placeholder="Tell me more..."
            {...form.getInputProps("body")}
          />

          <Button type="submit">Create todo</Button>
        </form>
      </Modal>

      <Group position="center">
        <Button fullWidth mb={12} onClick={() => setOpen(true)}>
          Add todo
        </Button>
      </Group>
    </>
  );
};

export default AddTodo;
