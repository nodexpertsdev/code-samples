import React, { Component, PropTypes } from 'react';

import { Card, CardActions } from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';

import { colorLink, colorRemove, colorSuccess, colorWhite } from '/imports/client/colors';

import Menubar from '../../Menubar';
import ModelDetails from './ModelDetails.js';
import EditModelForm from '../EditModelForm';

class Models extends Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired,
    models: PropTypes.array,
    makeFavorite: PropTypes.func.isRequired,
    removeModel: PropTypes.func.isRequired,
    openDialog: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired,
  };

  openModelFormDialog = (id) => {
    this.props.openDialog({
      title: id ? 'Edit Model' : 'Add Model',
      children: (
        <EditModelForm
          modelId={id}
          onCancel={this.props.closeDialog}
          onUpdate={this.props.closeDialog}
        />
      ),
      actions: [],
      actionsContainerStyle: { position: 'relative' },
      contentStyle: { maxWidth: 'none' },
      autoScrollBodyContent: true,
      bodyStyle: { padding: '0px' },
      onRequestClose: this.props.closeDialog,
    });
  };

  openModelRemoveDialog = (id) => {
    this.props.openDialog({
      title: 'Remove Model',
      children: (
        <p className="dialog-content">Are you sure you would like to remove this model? 
          &nbsp;<b>This cannot be undone.</b>
        </p>
      ),
      submitButtonProps: {
        label: 'Remove',
        onTouchTap: () => this.props.removeModel(id),
        labelStyle: { color: colorWhite },
        secondary: true,
      },
    });
  };

  renderModelItems() {
    return this.props.models.map((item, idx) => (
      <div className="flexbox" key={`label-${idx}`}>
        <Card className="card" >
          <ModelDetails model={item} />
          <Divider />
          <CardActions className="arrange">
            <FlatButton
              label="Edit"
              onTouchTap={() => this.openModelFormDialog(item._id)}
              labelStyle={{ color: colorLink }}
            />
            {!item.favorite && (
              <FlatButton
                label="Make Favorite"
                onTouchTap={() => this.props.makeFavorite(item._id)}
              />
            )}
            <FlatButton
              label="Remove"
              onTouchTap={() => this.openModelRemoveDialog(item._id)}
              labelStyle={{ color: colorRemove }}
            />
          </CardActions>
        </Card>
      </div>
    ));
  }

  render() {
    const menubarButtons = [{
      linkLabel: 'Add Model',
      raised: true,
      color: colorSuccess,
      onClick: () => this.openModelFormDialog(),
    }];

    return (
      <div className="scroller-wrapper">
        <Menubar
          header="Models"
          menubarButtons={menubarButtons}
        />
        <div className="scroller">
          <div>
            {this.props.loading ? (
              <div className="loading-wrapper">
                <CircularProgress className="loading" />
              </div>
            ) : (
              <div className="flex-box">
                {this.props.models.length > 0 ?
                  this.renderModelItems() : null
                }
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Models;
