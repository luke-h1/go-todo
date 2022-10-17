import { Box, List, ThemeIcon } from "@mantine/core";
import "./App.css";
import useSWR from "swr";
import AddTodo from "./components/AddTodo";
import { CheckCircleFillIcon } from "@primer/octicons-react";

export const SERVER_URL = "http://localhost:4000";

export interface Todo {
  id: number;
  title: string;
  done: boolean;
  body: string;
}

const fetcher = (endpoint: string) =>
  fetch(`${SERVER_URL}${endpoint}`).then((res) => res.json());

function App() {
  const { data, mutate } = useSWR<Todo[]>("/api/todos", fetcher);

  async function markTodoAsDone(id: number): Promise<void> {
    const updated = await fetch(`${SERVER_URL}/api/todos/${id}/done`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    mutate(updated);
  }

  async function markTodoAsUncompleted(id: number): Promise<void> {
    const updated = await fetch(`${SERVER_URL}/api/todos/${id}/incomplete`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    mutate(updated);
  }

  return (
    <Box
      sx={(theme) => ({
        padding: "2rem",
        width: "100%",
        maxWidth: "40rem",
        margin: "0 auto",
        color: "#fff",
      })}
    >
      <List spacing="xs" size="sm" mb={12} center>
        {data?.map((todo) => (
          <List.Item
            onClick={() => {
              if (todo.done) {
                markTodoAsUncompleted(todo.id);
              }
              markTodoAsDone(todo.id);
            }}
            key={todo.id}
            icon={
              todo.done ? (
                <ThemeIcon color="teal" size={24} radius="xl">
                  <CheckCircleFillIcon />
                </ThemeIcon>
              ) : (
                <ThemeIcon color="gray" size={24} radius="xl">
                  <CheckCircleFillIcon />
                </ThemeIcon>
              )
            }
          >
            {todo.title}
          </List.Item>
        ))}
      </List>

      <AddTodo mutate={mutate} />
    </Box>
  );
}

export default App;
