import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
export default class grafica extends Component {
    constructor(props){
        super(props);
        this.state = {
            datos:[]
        }
    }
    async componentDidMount(){
            const res = await fetch("https://gorest.co.in/public/v1/users",
            {
                method:"GET",
                headers: {
                    'Content-Type': 'application/json'
                  }
            })
            const result = await res.json();
            this.setState({
                datos:result.data
            })
            console.log(this.state.datos)
    }
    render() {   
        const columns = [{
                dataField: 'id',
                text: 'ID'
            },{
                dataField: 'name',
                text: 'Nombre'
            },{
                dataField: 'email',
                text: 'Correo'
        },{
            dataField:'gender',
            text:'Genero'
        },
        {
            dataField:'status',
            text:'Estatus'
        }]
        return (
            <div>
               <BootstrapTable striped bordered keyField='id' data={this.state.datos} columns={columns}/>
            </div>
        )
    }
}
