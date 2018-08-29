const Todos = require('../models/todos.model');

/**
 * GET all todos
 * @param req
 * @param res
 * @returns void
 */
exports.getAllTodos = (req, res) => {
	//console.log(Estado.findAll());
	Todos.find().then(todos => {
		return res.status(200).send(todos);
	}, err => {
		return res.status(500).send(err);
	});
}

/**
 * GET one todo
 * @param req
 * @param res
 * @returns void
 */
exports.getTodo = (req, res) => {
	Todos.findById(req.params.id).then(todo => {
		return res.status(200).send(todo);
	}, err => {
		return res.status(500).send(err);
	});
}

/**
 * GET completed todos
 * @param req
 * @param res
 * @returns void
 */
exports.getCompletedTodos = (req, res) => {
	Todos.find({done: true}).then(todos => {
		return res.status(200).send(todos);
	}, err => {
		return res.status(500).send(err);
	});
}

/**
 * GET uncompleted todos
 * @param req
 * @param res
 * @returns void
 */
exports.getUncompletedTodos = (req, res) => {
	Todos.find({done: false}).then(todos => {
		return res.status(200).send(todos);
	}, err => {
		return res.status(500).send(err);
	});
}

/**
 * POST add todo
 * @param req
 * @param res
 * @returns void
 */
exports.addTodo = (req, res) => {
    if(req.body.name.length <= 0){
        return res.status(400).send({msg:"Todo Name is required"});
    } else {
        Todos.create({
            name: req.body.name,
            completed: false
        }).then(todo => {
            return res.status(201).send(todo);
        }, err => {
            console.log(err);
            return res.status(500).send(err);
        });
    }
	
}

/**
 * PUT edit todo
 * @param req
 * @param res
 * @returns void
 */
exports.editTodo = (req, res) => {
	Todos.findById(req.params.id).then(todo => {

        if(!todo){
            return res.status(404);
        } else {
            todo.name = req.body.name;
            todo.done = req.body.done;
    
            todo.save().then(todo => {
                return res.status(200).send(todo);
            }, err => {
                console.log(err);
                return res.status(500).send(err);
            });
        }

    }, err => {
        console.log(err);
        return res.status(500).send(err);
    });
}

/**
 * DELETE todo
 * @param req
 * @param res
 * @returns void
 */
exports.deleteTodo = (req, res) => {
	Todos.findByIdAndRemove(req.params.id).then(todo => {
        return res.status(202).send(todo);
    }, err => {
        console.log(err);
        return res.status(500).send(err);
    });
}