const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/appError');

exports.createUser = catchAsync(async (req, res, next) => {
  const { username, email, password, role = 'user' } = req.body;

  //1. crear una instancia de la clase user
  const user = new User({ username, email, password, role });
  //2. encriptar la contraseña
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  //3. guardar en la base de datos con las contraseñas encriptadas
  await user.save();
  //4. generar el jwt
  const token = await generateJWT(user.id);

  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});
//==============================================================================================
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1. Check if user exist && password is correct
  const user = await User.findOne({
    where: {
      //nombre propiedad y lo que recibo del body
      email: email.toLowerCase(),
      status: true,
    },
  });
  console.log(user)
//Si no existe el usuario envio un error 404
  if (!user) {
    return next(new AppError('The user could not be found', 404));
  }
//Verificamo y comparamo la contraseña enviada con la constraseña encriptada
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //2. if everything ok, send token to client (Genero token y envio al cliente)
  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.renewToken = catchAsync(async(req,res,next)=>{
  //obtenemos id de la session
const {id}= req.sesionUser;
//Generamos un nuevo usuario
const token = await generateJWT(id)
//Buscamos el usuario
const user = await User.findOne({
  where:{
    status:true,
    id,
  }
})
return res.status(200).json({
  status:'success',
  user:{
    id:user.id,
    name:user.name,
    email:user.email,
    role:user.role,
  }
})
})