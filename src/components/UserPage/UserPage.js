import React , {Component} from 'react';
import { connect } from 'react-redux';
import UserPageOrders from './UserPageOrders';
import ManagerPageOrders from './ManagerPageOrders';
import Grid from '@material-ui/core/Grid';

const moment = require('moment');
const currentDate = moment().format('L')
class UserPage extends Component {

// this could also be written with destructuring parameters as:
// const UserPage = ({ user }) => (
// and then instead of `props.user.username` you could use `user.username`
// this.render
// 
render(){
  let userPageContent;
  if (this.props.user.manager===false){
    userPageContent = 
      <UserPageOrders history={this.props.history} />
  }else{
    userPageContent =
      <ManagerPageOrders history={this.props.history} />
  }
  return(
    <div>
      <Grid container
          spacing={20}
          direction="column"
          alignItems="center">
     <h1>Welcome, { this.props.user.username }!</h1>
     <h4>{currentDate}</h4> 
     {userPageContent}
      </Grid>
   </div>
  )
}
}
// Instead of taking everything from state, we just want the user info.
// if you wanted you could write this code like this:
// const mapStateToProps = ({user}) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UserPage);
