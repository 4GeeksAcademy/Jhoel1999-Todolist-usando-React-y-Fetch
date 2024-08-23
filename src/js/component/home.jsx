import React, { useState, useEffect} from "react";

//create your first component
const Home = () => {
    //1. Declarar el espacio del input (formulario)
    const [tarea, setTarea] = useState("");
    const [lista, setLista] = useState([]);

	const createUser = async () => {
		const request = await fetch(
		  "https://playground.4geeks.com/todo/users/JhoelTareas",
		  {
			method: "GET",
			headers: {
			  "Content-Type": "application/json",
			},
		  }
		);
		const response = await request.json();
		setLista(response.todos);
	  };
	
	  const createTask = async () => {
		if (!tarea) {
		  return alert("Ingresa una tarea válida");
		}
	
		const request = await fetch(
		  "https://playground.4geeks.com/todo/todos/JhoelTareas",
		  {
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({
			  label: tarea,
			  is_done: false,
			}),
		  }
		);
	
		const response = await request.json();
		setLista([...lista, response]);
		setTarea("");
	  };
	
	  const deleteTodo = async (id) => {
		await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
		  method: "DELETE",
		  headers: {
			"Content-Type": "application/json",
		  },
		});
	
		const filterLista = lista.filter((task) => task.id !== id);
		setLista(filterLista);
	  };
	
	  const deleteAll = async () => {
		const deleteTaskPromises = lista.map(async (task) => {
		  await fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
			method: "DELETE",
			headers: {
			  "Content-Type": "application/json",
			},
		  });
		});
	
		setLista([]);
		console.log("All tasks deleted");
	  };
	
	  useEffect(() => {
		createUser();
		console.log(lista);
		
	  }, []);

    return (
        <div className="container mt-4">
            <h1 className="text-center">Lista de Tareas</h1>
            <div className="bg-light w-50 mx-auto rounded">
                <ul className="list-group">
                    <li className="list-group-item">
                        <input
                            type="text"
							className="w-100 border-0"
                            placeholder={lista === 0 ? "No hay tareas, añadir tareas." : "¿Qué hay que hacer?"}
                            /*2. Asignar el evento onChange para vigilar los cambios*/
                            onChange={(e) =>{console.log(tarea); setTarea(e.target.value);}}
                            value={tarea}
                            /*3. Asignar el evento onkeyUp para agregar una tarea a la lista*/
                            onKeyUp={(e) => {
                                if (e.key === "Enter" && tarea !== "") {
                                    console.log("agregar");
                                    createTask();
                                    setTarea("");
                                }
                            }}
                        />
                    </li>

                    {/*4. Mostrar la tarea en la lista*/}
                    {lista.map((tarea, id) => (
                        <li key={id} className="list-group-item d-flex justify-content-between align-items-center px-4">
                            <span>{tarea.label}</span>
                            <span className="p-0">
								<i className="fa fa-trash d-none"
                                    /*5. Eliminar la lista cada tarea*/
                                    onClick={() => {
                                        console.log("eliminado");
                                        deleteTodo(tarea.id);
                                    }}
                                ></i>
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="text-danger p-2">
                    {lista.length} tareas pendientes
                </div>
				<div className="w-100 d-flex py-2">
					<button className="btn btn-danger m-auto" onClick={deleteAll}>
					Eliminar todo.
					</button>
				</div>
            </div>
        </div>
    );
};

export default Home;