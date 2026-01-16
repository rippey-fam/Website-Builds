import AddButton from "./AddButton";
import TodoList from "./TodoList";
import { TodoProvider } from "./useTodoList";

export default function App() {
    return (
        <>
            <h1
                style={{
                    textAlign: "center",
                }}
            >
                Todo List
            </h1>
            <TodoProvider>
                <TodoList />
                <AddButton />
            </TodoProvider>
        </>
    );
}
