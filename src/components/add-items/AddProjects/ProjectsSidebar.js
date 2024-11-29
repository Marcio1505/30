import React from 'react';
import { PropTypes } from 'prop-types';
import { useIntl } from 'react-intl';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Label, FormGroup, Button, Form } from 'reactstrap';
import Select from 'react-select';
import { X } from 'react-feather';
import classnames from 'classnames';

import PercentageField from '../../inputs/PercentageField';

const ProjectsSidebar = ({
  project,
  updateProject,
  addNewProject,
  handleSidebar,
  show,
  projects,
  projectsTook,
}) => {
  const intl = useIntl();
  const projectsAvailables = projects.filter((_project) => {
    if (projectsTook.find((took) => took.id === _project.id)) {
      if (_project.id === project.id) {
        return true;
      }
      return false;
    }
    return true;
  });

  const initialValues = {
    rowId: project.rowId || '',
    id: project.id || '',
    percentage: project.pivot?.percentage || '',
  };

  const validationSchema = Yup.object().shape({
    id: Yup.string().required(intl.formatMessage({ id: 'errors.required' })),
    percentage: Yup.number().required(
      intl.formatMessage({ id: 'errors.required' })
    ),
  });

  const onSubmit = (values) => {
    const _project = projects.find(
      (project) => parseInt(project.id) === parseInt(values.id)
    );
    if (project.id) {
      updateProject({
        ...values,
        name: _project.name,
      });
    } else {
      addNewProject({
        ...values,
        name: _project.name,
      });
    }
    formik.setValues(initialValues);
    handleSidebar(false, true);
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  });

  return (
    <div
      className={classnames('data-list-sidebar', {
        show,
      })}
    >
      <div className="data-list-sidebar-header mt-2 px-2 d-flex justify-content-between">
        <h4>{project.id ? 'Editar' : 'Adicionar'}</h4>
        <X size={20} onClick={() => handleSidebar(false, true)} />
      </div>
      <Form onSubmit={formik.handleSubmit}>
        <div className="m-3">
          {Boolean(formik?.initialValues.id || !project.id) && (
            <FormGroup>
              <Label for="project_id">
                <Label for="data-id">Projeto *</Label>
              </Label>
              <Select
                options={projectsAvailables}
                className="React"
                classNamePrefix="select"
                id="project_id"
                name="project_id"
                onBlur={formik.handleBlur}
                placeholder="Selecionar"
                value={projectsAvailables.filter(
                  (_project) => _project.value === formik.values.id
                )}
                onChange={(option) => formik.setFieldValue('id', option.value)}
              />
              {formik.errors.id && formik.touched.id ? (
                <div className="invalid-tooltip mt-25">{formik.errors.id}</div>
              ) : null}
            </FormGroup>
          )}
          <FormGroup>
            <PercentageField formik={formik} />
          </FormGroup>
          <div className="data-list-sidebar-footer d-flex justify-content-end align-items-center mt-2">
            <Button color="primary" type="submit" className="ml-1">
              Salvar
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

ProjectsSidebar.propTypes = {
  project: PropTypes.object,
  updateProject: PropTypes.func,
  addNewProject: PropTypes.func,
  handleSidebar: PropTypes.func,
  show: PropTypes.bool,
  projects: PropTypes.array,
  projectsTook: PropTypes.array,
};

ProjectsSidebar.defaultProps = {
  project: {},
  updateProject: () => {},
  addNewProject: () => {},
  handleSidebar: () => {},
  show: false,
  projects: [],
  projectsTook: [],
};

export default ProjectsSidebar;
