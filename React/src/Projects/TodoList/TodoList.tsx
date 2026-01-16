import { useTodoListContext } from "./useTodoList";
export default function TodoList() {
    const { list, updateItem } = useTodoListContext();
    let lastChecked = false;
    return (
        <ul>
            {list
                .sort((a, b) => (a.complete && b.complete ? 0 : a.complete ? 1 : -1))
                .map((item, key) => {
                    let addHR = false;
                    if (lastChecked !== item.complete) {
                        lastChecked = item.complete;
                        addHR = true;
                    }
                    return (
                        <li key={key}>
                            {addHR && <hr />}
                            <label
                                style={{
                                    userSelect: "none",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={item.complete}
                                    onChange={(ev) => {
                                        updateItem(item, { complete: ev.target.checked });
                                    }}
                                />{" "}
                                {item.title}
                            </label>
                        </li>
                    );
                })}
        </ul>
    );
}
