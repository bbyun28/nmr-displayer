/*!

=========================================================
* Now UI Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect, useState } from 'react';

// reactstrap components
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import ClipLoader from 'react-spinners/ClipLoader';

// core components
import PanelHeader from '../components/PanelHeader/PanelHeader.jsx';
import NMRDisplayer from '../../component/NMRDisplayer.jsx';
import { Analysis } from '../../data/Analysis';

function loadData() {
  return new Promise((resolve, reject) => {
    fetch('./json-files/Coffe.json')
      .then((response) => checkStatus(response) && response.json())
      .then((data) => {
        Analysis.build(data).then((obj) => {
          resolve(obj);
        });
      })
      .catch((err) => {
        reject(err);
      }); // Never forget the final catch!
  });
}

function checkStatus(response) {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
  }
  return response;
}

const CoffeView = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    loadData().then((d) => {
      setData(d);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col md={12}>
            <Card>
              <CardHeader>
                <h5 className="title">NMR Displayer</h5>
                <p className="category">Coffee </p>
              </CardHeader>
              <CardBody>
                <ClipLoader
                  css={{
                    position: 'absolute',
                    left: 350,
                    top: 275,
                  }}
                  sizeUnit={'px'}
                  size={30}
                  color={'#2ca8ff'}
                  loading={isLoading}
                />

                <NMRDisplayer data={data} stackedMode={true} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default CoffeView;
