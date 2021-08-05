import React, { useEffect, useState } from "react";
import { Card, Modal, Button, Form } from "react-bootstrap";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { countriesGDP } from "../Components/Shared/data"
import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import Map, {
    Export,
    Label,
    Layer,
    Legend,
    Source,
    Subtitle,
    Title,
    Tooltip
  } from 'devextreme-react/vector-map';

export const First = () => {
  const [countries, setcountries] = useState([]);
  const [data, setdata] = useState([]);
  const [search, setsearch] = useState(String);
  const [query, setquery] = useState(String);
  const [isclick, setisclick] = useState(String);
  const [show, setShow] = useState(false);
  const [showMC, setShowMC] = useState(false);
  const [idChart, setidChart] = useState("");
  const [options, setoptions] = useState({
    title: {
      text: "Default",
    },
    xAxis: {
      categories: [],
    },
    series: [{}],
  });
  
  const [queryCoor, setqueryCoor] = useState(String);
  const [markersData, setmarkersData] = useState({
    location: [],
    tooltip: {
      text: 'Times Square'
    }
  })

  const colorGroups = [0, 10000, 50000, 100000, 500000, 1000000, 10000000, 50000000];
  function customizeLayer(elements) {
    elements.forEach((element) => {
      const countryGDPData = countriesGDP[element.attribute('name')];
      element.attribute('total', countryGDPData && countryGDPData.total || 0);
    });
  }

  const format = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0
  }).format;
  
  function customizeLegendText(arg) {
    return `${format(arg.start)} to ${format(arg.end)}`;
  }
  /*
  Se usa el hook useEffect para que 
  haga el render solo cuando [] cambie
  y ejecute la funcion x()(se hace el reender
  solo del componente actualizado)
  */
  useEffect(() => {
    GetCountries();
  }, [query]);

  useEffect(() => {
    GetCountriesById();
  }, [isclick]);

  useEffect(() => {
    getInfoChart();
  }, [idChart]);

  useEffect(() => {
      getCoordinates();
  }, [queryCoor])

  let url = "https://covid-193.p.rapidapi.com/statistics?country=";
  let headers = {
    "Content-Type": "application/json",
    "x-rapidapi-key": "16a3c5cf19mshfec545cf06982fdp15f8c0jsn8ba423a52fb3",
    "x-rapidapi-host": "covid-193.p.rapidapi.com",
  };
  const GetCountries = async () => {
    if (query === "") {
      url = "https://covid-193.p.rapidapi.com/statistics";
    } else {
      url = "https://covid-193.p.rapidapi.com/statistics?country=" + query + "";
    }
    const res = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    const result = await res.json();
    setcountries(result.response);
  };

  const GetCountriesById = async () => {
    if (isclick === null) return;
    const res = await fetch(url + isclick, {
      method: "GET",
      headers: headers,
    });
    const result = await res.json();
    setdata(result.response);
  };

  const getInfoChart = async () => {
    if (idChart === "") return;
    const res = await fetch(
      "https://coronavirus-map.p.rapidapi.com/v1/spots/week?region=" +
        idChart +
        "",
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "16a3c5cf19mshfec545cf06982fdp15f8c0jsn8ba423a52fb3",
          "x-rapidapi-host": "coronavirus-map.p.rapidapi.com",
        },
      }
    );
    const result = await res.json();

    const datos = result.data;

    let categories = [];
    let total_cases = [];
    let deaths = [];
    let recovered = [];
    let critical = [];
    let tested = [];
    console.log(datos);
    for (var k in datos) {
      categories = [...categories, k];
      total_cases = [...total_cases, datos[k].total_cases];
      deaths = [...deaths, datos[k].deaths];
      recovered = [...recovered, datos[k].recovered];
      critical = [...critical, datos[k].critical];
      tested = [...tested, datos[k].tested];
    }

    setoptions({
      title: { text: idChart },
      xAxis: { categories: categories.reverse() },
      series: [
        {
          name: "Total Cases",
          data: total_cases.reverse(),
        },
        {
          name: "Deaths",
          data: deaths.reverse(),
        },
        {
          name: "Recoveres",
          data: recovered.reverse(),
        },
        {
          name: "Critical",
          data: critical.reverse(),
        },
        {
          name: "Tested",
          data: tested.reverse(),
        },
      ],
    });
    //   setdata(result.response)
  };

  const getCoordinates = async() =>{
    if(queryCoor === "")
    return

    const res = await fetch(
        "https://covid-19-data.p.rapidapi.com/country?name=" +
          queryCoor +
          "",
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": "16a3c5cf19mshfec545cf06982fdp15f8c0jsn8ba423a52fb3",
            "x-rapidapi-host": "covid-19-data.p.rapidapi.com"
          },
        }
      );
      const result = await res.json();
    //   console.log(result);
    //   setmarkersData(result);
      let latitude = "";
      let longitude = "";
      for (const key in result) { 
            latitude = result[key].latitude
            longitude = result[key].longitude
          }

          setmarkersData({
            location:{
                latitude,longitude
              },
              tooltip:{text:queryCoor}
          })

      }
      

  const updateSearch = (e) => {
    setsearch(e.target.value);
  };

  const getSearch = (e) => {
    e.preventDefault();
    setquery(search);
  };

  const handleClose = () => {
    setShow(false);
    setShowMC(false);
  };
  const handleShow = (e) => {
    setShow(true);
    setisclick(e.target.value);
  };
  const handelShowChart = (e) => {
    setShowMC(true);
    setidChart(e.target.value);
  };

  const updatequeryCoor = (e) =>{
    setShowMC(false)
    setqueryCoor(e.target.value)
  }


  return (
    <>
      <Form onSubmit={getSearch}>
        <Form.Group controlId="formPais">
          <Form.Label>País</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese un país"
            onChange={updateSearch}
          />
          <input type="submit" value="Buscar"></input>
        </Form.Group>
      </Form>
      <br />
      <div className="row">
        {countries.map((i, idx) => {
          return (
            <div className="col-sm-4" key={idx}>
              <Card>
                <Card.Body>
                  <Card.Title>Covid - {i.country}</Card.Title>
                  <Card.Text>{i.continent}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                    <Button
                      value={i.country}
                      variant="primary"
                      onClick={handleShow}
                    >
                      info
                    </Button>
                    <Button
                      value={i.country}
                      variant="primary"
                      onClick={handelShowChart}
                    >
                      Ultima semana
                    </Button>
                    <Button
                      value={i.country}
                      variant="primary"
                      onClick={updatequeryCoor}
                    >
                        Mapa info
                    </Button>
                  </small>
                </Card.Footer>
              </Card>
              <br />
            </div>
          );
        })}
      </div>
      {data.map((item, idx) => {
        return (
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            key={idx}
          >
            <Modal.Header closeButton>
              <Modal.Title>{item.country}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Casos:
              <ul>
                <li>Nuevos : {item.cases.new}</li>
                <li>Activos : {item.cases.active}</li>
                <li>Criticos : {item.cases.critical}</li>
                <li>Recuperados : {item.cases.recovered}</li>
                <li>Total : {item.cases.total}</li>
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <p>Ultima actualización: {item.day}</p>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              {/* <Button variant="primary">Understood</Button> */}
            </Modal.Footer>
          </Modal>
        );
      })}

      <Modal
        show={showMC}
        onHide={handleClose}
        // backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reporte ultima semana</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* <Button variant="primary">Understood</Button> */}
        </Modal.Footer>
      </Modal>

      <Map
      elementAttr={{ id: 'vector-map' }} bounds={[-180, 85, 180, -60]}
      >
      <Layer
        name="areas"
        dataSource={mapsData.world}
        colorGroups={colorGroups}
        colorGroupingField="total"
        customize={customizeLayer}
      >
        <Label dataField="name" enabled={true}
        
         />
      </Layer>

      <Legend customizeText={customizeLegendText} >
        <Source layer="areas" grouping="color"/>
      </Legend>

      <Title text="Title">
        <Subtitle text="Sub title" />
      </Title>

      <Tooltip enabled={false} />
        {/* // contentRender={TooltipTemplate} /> */}
      <Export enabled={false} />
    </Map>
    </>
  );
};

export default First;
