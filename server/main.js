import { Meteor } from 'meteor/meteor';
import { onPageLoad } from "meteor/server-render";
import { Mongo } from 'meteor/mongo';
import { relative } from 'path';


Meteor.startup(() => {
  
  const Participantes = new Mongo.Collection('participantes');
  const Atividades = new Mongo.Collection('atividades');
  const Socio = new Mongo.Collection('socio')
  var fs = Npm.require('fs')
  var path = Npm.require('path')

  Meteor.methods({
    'inserirParticipante'(participante) {
      Participantes.insert(participante);
    },
    'buscaParticipante'(nome){
      Participantes.findOne({nome: nome})
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
    },
    'photoUpload'(file){
      var basepath = path.resolve('.').split('.meteor')[0]
      var relativePath = '/uploads/avatars/' + file.name
      targetPath = basepath + relativePath
      fs.writeFileSync(targetPath, file.binary, 'binary')
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