import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import authService from "../../services/auth";
import MenuHeaderMain from "../_components/MenuHeaderMain";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import "../home/index.css";
import treatmentService from "../../services/treatment";
import { Col, Row } from "react-bootstrap";
import CardTitle from "../_components/CardTitle";

function TreatmentFormScreen() {
  const [initialValues, setInitialsValues] = useState({
    title: "",
    kind: 1,
    description: "",
    date: "",
    treatment_location: "",
    files: "",
  });

  const navigate = useNavigate();
  let params = useParams();

  useEffect(() => {
    (async () => {
      if (params.id) {
        const result = await treatmentService.show(params.id);
        const dateFormatted = result.date.split('/').reverse().join('-')
        if (result) {
          setInitialsValues({...result, date: dateFormatted});
        }
      }
    })();
  }, [params]);

  async function handleRegister(values, { setSubmitting }) {
    try {
      if (params.id) {
        await treatmentService.update(params.id, { ...values });
        toast.success("Tratamento atualizado com sucesso!!");
      } else {
        await treatmentService.create({ ...values });
        toast.success("Tratamento adicionado com sucesso!!");
      }
      navigate("/treatment");
    } catch (error) {
      if (error.response.data.errors) {
        error.response.data.errors.full_messages.forEach((message) => {
          toast.error(message);
        });
      } else {
        toast.error("Falha ao salvar Tratamento");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <MenuHeaderMain />

      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <CardTitle title={'ADICIONAR TRATAMENTO'} />
        </Col>
      </Row>

      <Row className="justify-content-center px-4 mb-4">
        <Col xs={12} md={4}>
          <Formik
            initialValues={initialValues}
            validationSchema={yup.object().shape({
              title: yup.string().required("Titulo é um campo obrigatório"),
              date: yup
                .date()
                .default(function () {
                  return new Date();
                })
                .required("Data é um campo obrigatório"),
              treatment_location: yup
                .string()
                .required("Local é um campo obrigatório"),
            })}
            enableReinitialize={true}
            onSubmit={handleRegister}
          >
            {({
              values,
              setFieldValue,
              errors,
              handleChange,
              handleBlur,
              touched,
              isSubmitting,
              handleSubmit,
            }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <div className="form-size text-white">
                    <div className="form-group mt-3 text-start">
                      <label htmlFor="title">TÍTULO DO TRATAMENTO</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="DIGITE O TÍTULO DO TRATAMENTO"
                        name="title"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.title}
                      />
                      {errors.title && touched.title ? (
                        <span className="text-danger">{errors.title}</span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="form-group mt-3 text-start">
                      <label htmlFor="description">TIPO DO TRATAMENTO</label>
                      <select
                        className="form-control"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="kind"
                        value={values.kind}
                      >
                        <option value="remedio">Remédio</option>
                        <option value="fisioterapia">Fisioterapia</option>
                        <option value="estetico">Estético</option>
                        <option value="odontologico">Odontológico</option>
                        <option value="espiritual">Espiritual</option>
                        <option value="psicoterapico">Psicoterapia</option>
                      </select>
                    </div>

                    <div className="form-group mt-3 text-start">
                      <label htmlFor="description">
                        DESCRIÇÃO DO TRATAMENTO
                      </label>
                      <textarea
                        name="description"
                        className="form-control"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                      ></textarea>
                    </div>

                    <div className="form-group mt-3 text-start">
                      <label htmlFor="date">DATA DO TRATAMENTO</label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="DATA DO TRATAMENTO"
                        name="date"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.date}
                      />
                      {errors.date && touched.date ? (
                        <span className="text-danger">{errors.date}</span>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="form-group mt-3 text-start">
                      <label htmlFor="treatment_location">
                        LOCAL DO TRATAMENTO
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="DIGITE O LOCAL DO TRATAMENTO"
                        name="treatment_location"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.treatment_location}
                      />
                      {errors.tre && touched.tre ? (
                        <span className="text-danger">
                          {errors.treatment_location}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <Row className="my-3">
                      <Col xs="6" md="6">
                        <div className="d-grid mt-2">
                          <Link
                            to="/treatment"
                            className="btn btn-secondary mt-1 btn-lg"
                          >
                            Voltar
                          </Link>
                        </div>
                      </Col>
                      <Col xs="6" md="6">
                        <div className="d-grid mt-2 mb-4">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-1 btn btn-lg btn-primary"
                          >
                            {!params.id ? "CADASTRAR" : "ATUALIZAR"}
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </form>
              );
            }}
          </Formik>
        </Col>
      </Row>
    </>
  );
}

export default TreatmentFormScreen;
