class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados() {
        for (var i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}
class Bd {

    constructor() {

        var complemento = localStorage.getItem('complemento')

        if (complemento === null) {
            localStorage.setItem('complemento', 0)
        }
    }

    getProximoItem() {
        var proximoId = localStorage.getItem('complemento')
        return parseInt(proximoId) + 1
    }

    gravar(d) {

        var complemento = this.getProximoItem()

        localStorage.setItem(complemento, JSON.stringify(d))

        localStorage.setItem('complemento', complemento)

    }
    recuperarTodosRegistros() {
        var despesas = Array()

        var id = localStorage.getItem('complemento')

        for (var i = 1; i <= id; i++) {

            var despesa = JSON.parse(localStorage.getItem(i))

            if (despesa == null) {
                continue
            }
            despesa.id = i
            despesas.push(despesa)

        }

        return despesas
    }

    pesquisar(despesa) {
        var despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()

        console.log(despesa)

        console.log(despesasFiltradas)


        if (despesa.ano != '') {
            console.log("filtro de ano");
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        if (despesa.mes != '') {
            console.log("filtro de mes");
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        if (despesa.dia != '') {
            console.log("filtro de dia");
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        if (despesa.tipo != '') {
            console.log("filtro de tipo");
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        if (despesa.descricao != '') {
            console.log("filtro de descrição");
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        if (despesa.valor != '') {
            console.log("filtro de valor");
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }




        return despesasFiltradas


    }

    remover (id) {
        localStorage.removeItem(id)
    }

}

var bd = new Bd()

function cadastrarDespesa() {
    var ano = document.getElementById('ano')
    var mes = document.getElementById('mes')
    var dia = document.getElementById('dia')
    var tipo = document.getElementById('tipo')
    var descricao = document.getElementById('descricao')
    var valor = document.getElementById('valor')

    var despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if (despesa.validarDados()) {
        bd.gravar(despesa)

        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'

        $('#modalRegistroDespesa').modal('show')
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    }
    else {
        //console.log('Dados inválidos')

        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram inseridos corretamente'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'

        $('#modalRegistroDespesa').modal('show')
    }

}

function carregaListaDespesas(despesas = Array(), filtro = false) {
   // var despesas = Array()

   if (despesas.length == 0  && filtro == false){
    despesas = bd.recuperarTodosRegistros()
   }

    var listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''
    /*<td> 15/02/2018    </td>
                    <td> Alimentação    </td>
                    <td> Compras do mês    </td>
                    <td> 45 </td>*/

    despesas.forEach(function (d) {
        var linha = listaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo

        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        var btn = document.createElement ("button")

        btn.className = 'btn btn-danger'

        btn.innerHTML = '<i class="fas fa-times"></i>'

        btn.id = `id_despesa_${d.id}`

        btn.onclick = function(){
            
            
            var id = this.id.replace ('id_despesa_','')

            

            bd.remover(id)

            window.location.reload()

        }

        linha.insertCell(4).append(btn)

        console.log(d)

    })

}

function pesquisarDespesa() {
    var ano = document.getElementById('ano').value
    var mes = document.getElementById('mes').value
    var dia = document.getElementById('dia').value
    var tipo = document.getElementById('tipo').value
    var descricao = document.getElementById('descricao').value
    var valor = document.getElementById('valor').value

    var despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    var despesas = bd.pesquisar(despesa)

    this.carregaListaDespesas (despesas, true)


    /*var listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    /*<td> 15/02/2018    </td>
                    <td> Alimentação    </td>
                    <td> Compras do mês    </td>
                    <td> 45 </td>*/

   // despesas.forEach(function (d) {
     //   var linha = listaDespesas.insertRow()

      //  linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

       // switch (d.tipo) {
       //     case '1': d.tipo = 'Alimentação'
              //  break
           // case '2': d.tipo = 'Educação'
            //    break
           // case '3': d.tipo = 'Lazer'
            //    break
           // case '4': d.tipo = 'Saúde'
           //     break
          //  case '5': d.tipo = 'Transporte'
          //      break
       // }

      //  linha.insertCell(1).innerHTML = d.tipo

      //  linha.insertCell(2).innerHTML = d.descricao
      //  linha.insertCell(3).innerHTML = d.valor

    //})


}
