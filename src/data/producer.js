const amqp = require('amqplib/callback_api');

function producerQueue(numero, valor, data, emailClient){
  amqp.connect('amqp://guest:guest@localhost', function(err, conn){
    if(err){
      console.error(err);
    }
    conn.createChannel((err, channel) => {
      if(err){
        console.error(err);
      }
      try{
        const queue = 'listen';
        const message = {
          numero: numero,
          valor: valor,
          data: data,
          emailClient: emailClient
        };
        
        channel.assertQueue(queue, { durable: false});
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        
        console.log('Message sent successfully', message);
        // channel.sendToQueue(queue, Buffer.from(message));

        console.log(" [x] Sent %s", message);

      }catch(err){
        console.error(err);
      }
    });
    setTimeout(function() { conn.close(); process.exit(0) }, 500);
  });
}

module.exports = {producerQueue}