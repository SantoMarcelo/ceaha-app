import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { getFormData, getMediumData, adicionaAtividade, getAtividadesInternas, setAtividadeInterna, removeAtividade, getDataTable } from './js/services.js'

import './main.html';
//import './services.js';


const Participantes = new Mongo.Collection('participantes');
const Atividades = new Mongo.Collection('atividades');
const Socio = new Mongo.Collection('socio');

Meteor.startup(function () {

    sAlert.config({
        effect: '',
        position: 'bottom',
        timeout: 5000
    })

})

Router.route('/', function () {
    this.render('novoParticipante');
});
Router.route('/novoParticipante', function () {
    this.render('novoParticipante');
});
Router.route('/login', function () {
    this.render('acesso');
});
Router.route('/home', function () {
    this.render('listaParticipante');
});
Router.route('/editarParticipante/:_id', {
    name: 'edit',
    template: 'editarParticipante',
    data: function () {
        
        //var participante = Participantes.findOne({ _id: this.params._id });
        return Participantes.findOne({ _id: this.params._id });
    },

});
Router.route('/adicionarAtividade/:_id', {
    name: 'add activity',
    template: 'preenchimentoInterno',
    data: function () {
        
        //var participante = Participantes.findOne({ _id: this.params._id });
        return Participantes.findOne({ _id: this.params._id });
    },

});


Template.navbar.events({
    'click #botaoSair'(event, instance) {
        event.preventDefault();
        Meteor.logout();
        window.location.href = ('/');
    },

    'click #botaoLogin'(event, instance) {
        event.preventDefault();
        $('.navbar-brand').text('Por favor fazer login com seu usuário e senha');
        $('#paginaNovo').hide();
        $('#paginaAcesso').show();
        window.location.href = ('/login');
    },

    'click #novoParticipante'(event, instance) {
        window.location.href = ('/novoParticipante');
        $('.navbar-brand').text('Preencha seus dados abaixo');

    },
    'click #home'(event, instance) {
        window.location.href = ('/home');
    }

})

Template.navbar.helpers({
    fullName() {
        return Meteor.user().profile.name;
    }

})

Template.acesso.events({

    'click #botaoLogin'(event, instance) {
        event.preventDefault();

        var email = $('#login #loginEmail').val();
        var senha = $('#login #loginSenha').val();

        Meteor.loginWithPassword(email, senha, function (err) {
            if (err) {
                sAlert.error(err.reason)
            } else {
                console.log('to aqui');
                window.location.href = ('/home')
                sAlert.success('Olá, você foi autenticado.')

            }
        })

    },

    'click #botaoCadastrar'(event, instance) {
        event.preventDefault();

        var nome = $('#cadastro #cadastroNome').val();
        var email = $('#cadastro #cadastroEmail').val();
        var senha = $('#cadastro #cadastroSenha').val();

        var user = {
            email: email,
            password: senha,
            profile: { name: nome }
        }

        Accounts.createUser(user, function (err) {
            if (err) {
                if (err.reason = 'Email already exists.') {
                    sAlert.error('Você já está cadastrado.');
                } else {
                    sAlert.error(err.reason);
                }
            } else {
                console.log('tudo certo');
            }
        })


    },



})

Template.novoParticipante.helpers(function () {

})

Template.novoParticipante.onRendered(function () {
    $(document).ready(function(){
        $('#date-birth').inputmask("99-99-9999");
        $('.cep').inputmask('99999-999');
        $('#telefoneRes').inputmask('(99) 9999-9999');
        $('#telefoneCel').inputmask('(99) 99999-9999');
        $('.cpf').inputmask('999.999.999-99', {reverse: true});
        $('#telComercial').inputmask('(99) 99999-9999');
      });
        
    
})

Template.novoParticipante.events({

    'click #botaoContador'(event, instance) {
        event.preventDefault();

        var contador = Template.instance().contador.get();

        instance.contador.set(contador + 1);

    },

    'click #adicionaAtividade'(event, instance) {
        event.preventDefault();
        adicionaAtividade();
    },
    'click #removeAtividadeVoluntaria'(event, instance) {
        event.preventDefault();

        var table = document.getElementById("atividadeTable");
        var current = event.currentTarget;

        table.deleteRow(current.parentNode.parentNode.rowIndex)

    },

    'change #transferencia'(event, instance) {
        var transferencia = $('#transferencia').val();
        if (transferencia == 'Sim') {
            $('#nomeCentroEspirita').prop("disabled", false);
            $('#cidadeCentroEspirita').prop("disabled", false);
            $('#tempoCentroEspirita').prop("disabled", false);
            $('#ufCentroEspirita').prop("disabled", false);
        } else {
            $('#nomeCentroEspirita').prop("disabled", true);
            $('#cidadeCentroEspirita').prop("disabled", true);
            $('#tempoCentroEspirita').prop("disabled", true);
            $('#ufCentroEspirita').prop("disabled", true);
        }
    },

    'change #aposentadoria'(event, instance) {
        var aposentado = $('#aposentadoria').val();
        
        if (aposentado == "false") {
            $('#inputLocalTrabalho').prop("disabled", false);
            $('#telComercial').prop("disabled", false);
            $('#cepComercial').prop("disabled", false);
            $('#logradouroComercial').prop("disabled", false);
            $('#numeroComercial').prop("disabled", false);
            $('#bairroComercial').prop("disabled", false);
            $('#complementoComercial').prop("disabled", false);
            $('#cidadeComercial').prop("disabled", false);
            $('#ufComercial').prop("disabled", false);
        }else{
            $('#inputLocalTrabalho').prop("disabled", true);
            $('#telComercial').prop("disabled", true);
            $('#cepComercial').prop("disabled", true);
            $('#logradouroComercial').prop("disabled", true);
            $('#numeroComercial').prop("disabled", true);
            $('#bairroComercial').prop("disabled", true);
            $('#complementoComercial').prop("disabled", true);
            $('#cidadeComercial').prop("disabled", true);
            $('#ufComercial').prop("disabled", true);
        }
    },

    'change #escolaridade'(event, instance) {
        var escolaridade = $('#escolaridade').val();
        if (escolaridade <= 4) {
            $('#cursoEscolaridade').prop("disabled", true);
            $('#instituicaoEscolaridade').prop("disabled", true);
        } else {
            $('#cursoEscolaridade').prop("disabled", false);
            $('#instituicaoEscolaridade').prop("disabled", false);
        }
    },

    'click .checkbox-experienca-pratica'(event, instance) {
        console.log(event);
        console.log(instance.parentNode);
        $(".experiencia-pratica").each(function (i) {
            //console.log($(this).find('input.checkbox-experienca-pratica:checked'));
            if ($(this).find('input.checkbox-experienca-pratica:checked').length > 0) {
                 $(this).find('.input-time').prop("disabled", false);
            }
        });

    },

    'click #cadastrar'(event, instance) {
        event.preventDefault();
       var name = $('#full-name').val()
       var dt_nasc = $('#date-birth').val()
       var cpf = $('#cpf').val()
       var rg = $('#rg').val()
       var validator = true

       if(name == ""){
           sAlert.error("Campo Nome é obrigatório")
           validator = false
       }
       if(dt_nasc == ""){
           sAlert.error("Campo Data de Nascimento é obrigatório")
           validator = false
       }
       if(rg == ""){
        sAlert.error("Campo RG é obrigatório")
        validator = false
       }
       if(cpf == ""){
           sAlert.error("Campo CPF é obrigatório")
           validator = false
       }

        var participante = getFormData();
        if(validator){
            Meteor.call('inserirParticipante', participante, function (err, res) {
                if (err) {
                    sAlert.error(err.reason)
                    return false;
                } else {
                    sAlert.success('Participante cadastrado com sucesso.')
                    window.location.href = ('/')
                }
            })       
        }else{
            sAlert.error('Por favor preencha todos os dados obrigatórios')
        }
        
    }
})

Template.listaParticipante.onCreated(function () {
    this.participante = new ReactiveVar(Participantes.find());
})

Template.listaParticipante.rendered = function () {
    this.$("#busca").on("submit", function (e) { e.preventDefault() });
}

Template.listaParticipante.helpers({
    'listaParticipantes': function () {
        return Template.instance().participante.get();
    },

})

Template.listaParticipante.events({
    
    'click #editarContato'(event, instance) {
        event.preventDefault();
        //console.log(this._id);
        window.location.href = ('/editarParticipante/' + this._id);

    },

    'click #addAtividade'(event, instance) {
        event.preventDefault();
        //console.log(this._id);
        window.location.href = ('/adicionarAtividade/' + this._id);

    },
    'click #botaoBuscar'(event, instance) {
        event.preventDefault();
        var nome = $('#buscaNome').val();
        var resultado = Participantes.find({"nome": { $regex: nome}});
        instance.participante.set(resultado);
    },

    'click #limparPesquisa' (event, instance){
        event.preventDefault();
        var resultado = Participantes.find();
        instance.participante.set(resultado);
        $('#buscaNome').val();
    },

    'click #deletarContato'(event, instance){
        var dialog = $('#window');
        $('#deletarContato').click(function() {
         dialog.show();
        });
        var r=confirm("Você tem certeza que deseja apagar este participante?");
        if (r==true) {
            Meteor.call('deleteParticipante', this._id, function (err, res) {
                if (err) {
                    sAlert.error(err.reason)
                    return false;
                } else {
                    sAlert.success('Participante removido com sucesso com sucesso.')
                }
            })
        }
    }

})
Template.editarParticipante.onRendered(function () {
    $(document).ready(function(){
        $('#date-birth').inputmask("99-99-9999");
        $('.cep').inputmask('99999-999');
        $('#telefoneRes').inputmask('(99) 9999-9999');
        $('#telefoneCel').inputmask('(99) 99999-9999');
        $('.cpf').inputmask('999.999.999-99', {reverse: true});
        $('#telComercial').inputmask('(99) 99999-9999');
      });
        
    
})

Template.editarParticipante.onCreated(function () {
    
    this.atividades = new ReactiveVar(Atividades.find());
    var atividadeList = this.atividades.curValue.collection._docs._map
    console.log(atividadeList); 
    var transferencia = $('#transferencia').val();
    if (transferencia == 'Sim') {
        $('#nomeCentroEspirita').prop("disabled", false);
        $('#cidadeCentroEspirita').prop("disabled", false);
        $('#tempoCentroEspirita').prop("disabled", false);
        $('#ufCentroEspirita').prop("disabled", false);
    } else {
        $('#nomeCentroEspirita').prop("disabled", true);
        $('#cidadeCentroEspirita').prop("disabled", true);
        $('#tempoCentroEspirita').prop("disabled", true);
        $('#ufCentroEspirita').prop("disabled", true);
    }

})

Template.editarParticipante.helpers({
    'listaAtividades': function () {
        return Template.instance().atividadeList.get();
    },
})

Template.editarParticipante.events({

    'click #aposentadoria'(event, instance) {
        event.preventDefault();
        var aposentado = $('#aposentadoria').val();
        
        if (aposentado == "false") {
            $('#fieldDadosProfissionais').prop("disabled", false)
        }else{
            $('#fieldDadosProfissionais').prop("disabled", true)
        }
    },
    'click #editarProfissao'(event){
        event.preventDefault();
        $('#fieldDadosProfissionais').prop("disabled", false)
    },
    
    'click #adicionaAtividade'(event, instance) {
        event.preventDefault();
        adicionaAtividade();
    },
    'click #removeAtividadeVoluntaria'(event, instance) {
        event.preventDefault();

        var table = document.getElementById("atividadeTable");
        var current = event.currentTarget;

        table.deleteRow(current.parentNode.parentNode.rowIndex)

    },

    'click #transferencia'(event, instance) {
        event.preventDefault();
        var transferencia = $('#transferencia').val();
        if (transferencia == 'Sim') {
            $('#dadosTransferencia').prop("disabled", false)
        } else {
            $('#dadosTransferencia').prop("disabled", true)
        }
    },

    'click #editarDadosCentroEspirita'(event){
        event.preventDefault();
        console.log($('#dadosTransferencia'))
        $('#dadosTransferencia').prop("disabled", false)
    },
    

    'click #escolaridade'(event, instance) {
        event.preventDefault();
        var escolaridade = $('#escolaridade').val();
        if (escolaridade <= 4) {
            $('#dadosEscolares').prop("disabled", true)
        } else {
            $('#dadosEscolares').prop("disabled", false)
        }
    },

    'click #editarDadosEscolares'(event){
        event.preventDefault();
        $('#dadosEscolares').prop("disabled", false)
    },
    

    'click .checkbox-experienca-pratica'(event, instance) {
        event.preventDefault();
        $(".experiencia-pratica").each(function (i) {
            //console.log($(this).find('input.checkbox-experienca-pratica:checked'));
            if ($(this).find('input.checkbox-experienca-pratica:checked').length > 0) {
                 $(this).find('.input-time').prop("disabled", false);
            }
        });

    },

    'click #atividadeAno'(event){
        event.preventDefault();
        var myDate = new Date();
        var year = myDate.getFullYear();
        for(var i = 1950; i < year+1; i++){
            //document.find()write('<option value="'+i+'">'+i+'</option>');
            $('#atividadeAno').append('<option value="'+i+'">'+i+'</option>');
        }

        
    
        $('#atividadeAno').html(itensOrdenados);
    },

    'click #editar'(event, instance) {
        event.preventDefault();
        var name = $('#full-name').val()
        var dt_nasc = $('#date-birth').val()
        var cpf = $('#cpf').val()
        var rg = $('#rg').val()
        var validator = true
 
        if(name == ""){
            sAlert.error("Campo Nome é obrigatório")
            validator = false
        }
        if(dt_nasc == ""){
            sAlert.error("Campo Data de Nascimento é obrigatório")
            validator = false
        }
        if(rg == ""){
         sAlert.error("Campo RG é obrigatório")
         validator = false
        }
        if(cpf == ""){
            sAlert.error("Campo CPF é obrigatório")
            validator = false
        }
 
        var participante = getFormData()
        if(validator){
            if (this._id) {
                Meteor.call('updateParticipante', this._id, participante, function (err, res) {
                    if (err) {
                        sAlert.error(err.reason)
                        return false;
                    } else {
                        sAlert.success('Participante alterado com sucesso.')
                    }
                })
                
            } else {
                Meteor.call('inserirParticipante', participante, function (err, res) {
                    if (err) {
                        sAlert.error(err.reason)
                        return false;
                    } else {
                        sAlert.success('Participante cadastrado com sucesso.')
                    }
                })
            }
            //window.location.href = ('/home');
        }else{
            sAlert.error('Por favor preencha todos os dados obrigatórios')
        }
        
        // Meteor.call('inserirParticipante', participante, function(err, res){
        //   if (err) {
        //       sAlert.error(err.reason)
        //       return false;
        //   } else {
        //       sAlert.success('Participante cadastrado com sucesso.')
        //   }
        // })     
    },

    'click #cancelar'(event){
        event.preventDefault();
        window.location.href = ('/home');
    },

   

    'click #btnAddAtividadeInterna'(event, instance){
        event.preventDefault();
        var participante = getFormData()
        var atividade = getAtividadesInternas();
        atividade.participante_id = this._id;
        participante.atividades_internas = atividade;

        setAtividadeInterna();
        
        // Meteor.call('adicionaAtividadeInterna', this._id, atividade, function (err, res) {
        //     if (err) {
        //         sAlert.error(err.reason)
        //         return false;
        //     } else {
        //         sAlert.success('Atividade adicionada com sucesso.')
        //     }
        // })
        // Meteor.call('updateParticipante', this._id, participante, function (err, res) {
        //     if (err) {
        //         sAlert.error(err.reason)
        //         return false;
        //     } else {
        //         sAlert.success('Participante alterado com sucesso.')
        //     }
        // })
    }
})

Template.preenchimentoInterno.onCreated(function () {
    this.atividade = new ReactiveVar(Atividades.find());
    this.participante = new ReactiveVar(Participantes.find());
    this.socio = new ReactiveVar(Socio.find());
    this.deptoAtividade = new ReactiveVar()
})
 
Template.preenchimentoInterno.helpers({
    'listaAtividadesInternas': function () {
        
        return Template.instance().atividade.get();
    },
    'usuario': function () {
       
        return Template.instance().participante.get();
    },
    'listaSocio': function(){
        return Template.instance().socio.get();
    },
    'listaDeptoAtividades': function(){
        return Template.instance().deptoAtividade.get();
    }
})

Template.preenchimentoInterno.events({
    'click #btnAddAtividadeInterna'(event, instance){
        event.preventDefault();
        var atividades_internas = {
            ano: $('#atividadeInternaAno').val(),
            atividade: $('#selectAtividadeInterna option:selected').val(),
            freq_total: $('#atividadeInternaFreqTotal').val(),
            freq_real: $('#atividadeInternaFreqReal').val(),
            departamento: $('#atividadeInternaDepartamento option:selected').text(),
        }

            if (this._id) {
                Meteor.call('updateAtividadeInterna', this._id, atividades_internas, function (err, res) {
                    if (err) {
                        sAlert.error(err.reason)
                        return false;
                    } else {
                        sAlert.success('Atividade Alterada com sucesso.')
                    }
                })
            } else {
                Meteor.call('updateAtividadeInterna', atividades_internas, function (err, res) {
                    if (err) {
                        sAlert.error(err.reason)
                        return false;
                    } else {
                        sAlert.success('Atividade Cadastrada com sucesso.')
                    }
                })
            }
           
    },
    'click .checkbox-tipo-socio'(event, instance) {
        $(document).on("click", ".checkbox-tipo-socio", function () {
            var $valueField = $(this).parent().parent().find('.input-valor-mensal');
            if (this.checked) {
                $valueField.prop("disabled", false);
            } else {
                $valueField.prop("disabled", true);
                $valueField.val('')
            }
        });
    },

    'click #btnAddSocio'(event){
        event.preventDefault();
        data_criação = new Date(Date.now()).toLocaleString();

        var socio = {tipo: $('th').find('.checkbox-tipo-socio:checked').val(), 
            valor: $('th').find('.checkbox-tipo-socio:checked').parent().parent().find('.input-valor-mensal').val(), 
            user_id: this._id ,
            date_create: data_criação}
        
            if (this._id) {
                Meteor.call('updateSocioTipo', this._id, socio, function (err, res) {
                    if (err) {
                        sAlert.error(err.reason)
                        return false;
                    } else {
                        sAlert.success('Sócio alterado com sucesso.')
                    }
                })
            } else {
                Meteor.call('updateSocioTipo', socio, function (err, res) {
                    if (err) {
                        sAlert.error(err.reason)
                        return false;
                    } else {
                        sAlert.success('Sócio cadastrado com sucesso.')
                    }
                })
            }
            
    },
    'change #atividadeInternaDepartamento'(event){
        var depto = $('#atividadeInternaDepartamento').val()
        var depto_atividades
        switch(depto){
            case 'DIJE':
                    depto_atividades = [
                        {nome:'Diretor'} ,
                        {nome:'Diretor-Adjunto'} ,
                        {nome:'Grupo do Gena'} ,
                        {nome:'Grupo de pais'} ,
                        {nome:'Coordenador de Evangelho'} ,
                        {nome:'Colaborador passista'} ,
                        {nome:'Evangelizador'} ,
                        {nome:'Estudante'} 
                    ]
                Template.instance().deptoAtividade.set(depto_atividades)
                break
            case 'DECDE':
                    depto_atividades = [
                        {nome:'Diretor'} ,
                        {nome:'Diretor-Adjunto'} ,
                        {nome:'Secretaria'} ,
                        {nome:'Facilitador de grupos de estudos'} ,
                        {nome:'Estudante'} 
                    ]
                Template.instance().deptoAtividade.set(depto_atividades)
                break
            case 'DDOU':
                    console.log('Diretor, Diretor-Adjunto,  Leitor, Mesário, Palestrante, Palestrante Substituto')
                    break
            case 'DAFT':
                    console.log('Diretor, Diretor-Adjunto, Atendente  fraterno, Grupo  Enxugando lágrimas, Grupo Artesanato, Recepção da casa em diferentes horários.')
                    break
            case 'DMED':
                    console.log('Diretor, Diretor-Adjunto,  Primeiro-Dirigente de sessão mediúnica - Segundo-Dirigente  de sessão mediúnica, Dialogador, Médium psicofônico,  Médium psicógrafo, Médium vidente, Médium audiente, Médium pictógrafo,  Atividade de sustentação.')
                    break
            case 'DPAS':
                    console.log('Diretor, Diretor-adjunto, Secretaria, Coordenador,  Colaborador passista ')
                    break
            case 'DAPS':
                    console.log('Diretor, Diretor-Adjunto, Recepção masculina, Recepção feminina, Controle e distribuição de fichas feminino e masculino, Organização de doações: roupas e alimentos, Montagem de cestas básicas, Preparação de lanches, Atendimento de individual feminino - separação e entrega de  roupas etc., Atendimento individual masculino- separação e entrega de roupas, etc., Leitura na tribuna.')
                    break
            case 'DFAM':
                    console.log(' Diretor, Diretor-Adjunto, Semanas da Família, Campanha de Implantação do Culto do Evangelho no Lar, Grupo de pais, Programa de Rádio (Guarujá)')
                    break
            case 'DEVT':
                    console.log('Diretor, Diretor-Adjunto,')
                    break
            case 'DLIV':
                    console.log('Diretor, Diretor-Adjunto, Responsável pela Biblioteca, Auxiliar da Biblioteca,  Responsável pela Restauração, Restaurador de Livros, Auxiliar da Livraria.')
                    break
            case 'DART':
                    console.log('Diretor, Diretor-Adjunto, Oficina de cênicas, Oficina de locução, Leitura dramática.')
                    break
            case 'DCOM':
                    console.log('Diretor, Diretor-Adjunto, Editor de texto, Diagramador, Fotógrafo, Cinegrafista, Operador de áudio, Editor de vídeo, Iluminador, Locutor.')
                    break
        }
        
    }
})



