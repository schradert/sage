const db = new Map();

export function getTodos(userid) {
	if (!db.has(userid))
		createUpdateTodo({ userid, description: "Learn about API routes" });
	return Array.from(db.get(userid).values());
}

export function createUpdateTodo({ userid, description }) {
	if (!db.has(userid)) db.set(userid, new Map());
	if (description === "") throw new Error("todo must have a description");

	const todos = db.get(userid);

	todos.set(userid, {
		id: crypto.randomUUID(),
		description,
		done: false,
	});

	return { userid };
}

export function toggleTodo({ userid, id, done }) {
	const todos = db.get(userid);
	todos.get(id).done = done;
}

export function deleteTodo({ userid, id }) {
	const todos = db.get(userid);
	todos.delete(id);
}
