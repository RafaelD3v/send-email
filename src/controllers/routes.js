const express = require('express');
const {sendEmail} = require('../data/sendEmail');
const {producerQueue}  = require('../data/producer');
const {consumerQueue} = require('../data/consumer');
const routes = express.Router();

const text = {
    text: 'Trabalho AV2',
    user1: 'Emanuelle Neves',
    user2: 'Rafael Tavares',
    user4: 'Dante Dantas',
}

routes.get('/', (req, res) => res.send(text));

// Envie um e-mail com no formato abaixo utilizando as informações coletadas;
routes.get('/receiveMessage', (req, res) => res.render('pedido'));

routes.post('/receiveMessage', function (req, res) {
    const {numero} = req.body;
    const {valor} = req.body;
    const {data} = req.body;
    
    try {
        const pedido = producerQueue(parseInt(numero), parseFloat(valor), data);
        return res.status(200).json({ message: 'Pedido cadastrado com sucesso!', pedido});
    } 
    catch (error){
        if (error instanceof Error) {
            console.error(error);
            return res.status(400).json({ message: 'Pedido não cadastrado!' });
        }
    }
});

//  Envie uma mensagem com um número do pedido e o valor;
routes.get('/sendEmail', (req, res) => res.render('email'));

routes.post('/sendEmail', async (req, res) => {
    const {emailClient} = req.body;
    
    try {
        const mail = consumerQueue(emailClient);
        return res.status(200).json({ message: 'E-mail enviado com sucesso!', mail});
    } 
    catch (error){
        if (error instanceof Error) {
            console.error(error);
            return res.status(400).json({ message: 'E-mail não enviado!' });
        }
    }
});

module.exports = routes;