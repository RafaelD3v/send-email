const amqplib = require('amqplib/callback_api');
const {sendEmail} = require('./sendEmail');

function receiveMessage(emailClient){
    amqplib.connect('amqp://localhost', function(err, conn) {
        try{
            conn.createChannel(function(err, channel) {
                let queue = 'av2-unifor';
            
                channel.assertQueue(queue, {
                  durable: false
                });
        
                channel.consume(queue, function(message) {
                  let messagePedido = JSON.parse(message.content);
              
                  if((messagePedido.numero && messagePedido.valor && messagePedido.data) != undefined) {
                    sendEmail(emailClient, `<p> O pedido de número ${messagePedido.numero} com o total de R$ ${messagePedido.valor} foi cadastrado com sucesso. O prazo de entrega será até o dia ${messagePedido.data}. </p>`)
                  } 
                  else{
                    console.log("E-mail não enviado! Não há mensagem a ser enviada.")
                  }
                }, {
                  noAck: true
                })
            });

        }catch(err){}
    });

    console.log('deu bom, passou pelo receiveMessage', emailClient);
}

module.exports = {receiveMessage}