import { Meteor } from 'meteor/meteor';
import { onPageLoad } from "meteor/server-render";
import { Mongo } from 'meteor/mongo';


Meteor.startup(() => {
  
  const Insumos = new Mongo.Collection('insumos');
  const Produtos = new Mongo.Collection('produtos');
  const Socio = new Mongo.Collection('socio')
  const Categoria = new Mongo.Collection('categoria')
  

  Meteor.methods({
    'inserirParticipante'(insumo) {
      Insumos.insert(insumo);
    },
    'InserirProduto'(produto){
      Produtos.insert(produto)
    },
    'updateParticipante'(id, participante){
      Participantes.update({_id:id},{$set:participante});
    },
    'updateAtividadeInterna'(id, atividade){
      Participantes.update(
        {_id:id},
        { $addToSet: { atividades_internas: atividade } }
      );
    },
    'updateSocioTipo'(id, socio){
      Participantes.update(
        {_id:id},
        { $addToSet: { socio: socio } }
      );
    },
    'deleteParticipante'(id){
      Participantes.remove(
        {_id:id}
      );
    },
    'adicionaAtividadeInterna'(atividade){
      Atividades.insert(atividade);
    },
    'buscaAtividade'(){
      Atividades.find()
    },
    'adicionaSocio'(socio){
      Socio.insert(socio)
    }
  });
});


onPageLoad(sink => {
  // Code to run on every request.
  sink.renderIntoElementById(
    "server-render-target",
    `Server time: ${new Date}`
  );
});