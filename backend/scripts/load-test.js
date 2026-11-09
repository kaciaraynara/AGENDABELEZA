const autocannon = require('autocannon');

const url = process.env.API_URL || 'http://localhost:3333/public/salon/salao-das-flores';

const instance = autocannon({
  url: url,
  connections: 100, // número de conexões concorrentes
  pipelining: 1, 
  duration: 10, // duração em segundos
}, console.log);

// Mostra progresso
autocannon.track(instance, { renderProgressBar: true });

instance.on('done', (result) => {
  console.log('--- RELATÓRIO DE CARGA ---');
  console.log(`URL: ${result.url}`);
  console.log(`Conexões concorrentes: ${result.connections}`);
  console.log(`Requisições totais feitas: ${result.requests.total}`);
  console.log(`Média de Requisições por Segundo (RPS): ${result.requests.average}`);
  console.log(`Latência Média: ${result.latency.average} ms`);
  console.log(`Erros (Timeout / Outros): ${result.timeouts} / ${result.errors}`);
  if (result.non2xx > 0) {
    console.warn(`ATENÇÃO: Houve ${result.non2xx} requisições que não retornaram código 2xx (provavelmente 404 porque o salão não existe no seu banco de teste, mas a rota em si aguentou).`);
  }
  console.log('--------------------------');
  
  if (result.errors > 0 || result.timeouts > 0) {
    process.exit(1);
  }
});
