import React,{useContext,useState,useRef,useEffect} from 'react';
import gql from 'graphql-tag';
import {useQuery,useMutation,useLazyQuery} from '@apollo/react-hooks';
import { Button,Icon,Container,Segment,Header,Label,Image, Card, Grid,Form } from 'semantic-ui-react';
import OrgLikeButton from '../components/orgcomponents/OrgLikeButton'
import moment from 'moment';
import {AuthContext} from '../context/auth';
import OrgDeleteButton from '../components/orgcomponents/OrgDeleteButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../util/MyPopup';
import OrgPostCard from '../components/orgcomponents/OrgPostCard'
import OrgPostForm from '../components/orgcomponents/OrgPostForm';
import { FETCH_ORGPOSTS_QUERY } from '../util/graphql';
import FileUpload from '../components/FileUpload';
import Uploads from '../components/Uploads'
import '../App.css';


function SingleOrg(props){

    //edw bazei sto postId tin timi tou post pou yparxei stin grammi tou url
    const orgId=props.match.params.orgId;
    const{user} = useContext(AuthContext);

    const {loading,data:{getOrganization}={}} = useQuery(FETCH_SINGLEORG_QUERY,{
        variables:{
            orgId
        }
    })

    
    const {orgName:orgname2}=getOrganization?getOrganization:[];
    console.log(orgname2);
    
    //variables2:{orgname:"enas allos organismos"};
    const [bookItem,{data:getOrgPostsByName}] = useLazyQuery(FETCH_SINGLEORGPOST_QUERY)
    useEffect(()=>{
        if(!loading){
            //EDW MPOREI NA YPARXEI THEMA KAI NA THELEI [] STA TYPEDEFS
           //bookItem({variables:{orgname:"enas allos organismos"}});
           bookItem({variables:{
               orgname:orgname2}
            });
           console.log("mpike sto useeffect")
        }
        return () => {
            console.log("This will be logged on unmount");
          }
    },[loading])

   console.log(getOrgPostsByName);
   
   //let epeidi einai conditional
   let postMarkup;
   if(!getOrganization || !getOrgPostsByName){
       //perimenoume na fortosei, mporoume na balooume kai kyklo pou gyrnaei
       postMarkup = <p>Loading Organization Page.....</p>
   }
   else{
       
       const {id,orgDescription,orgName,orgOwner,orgLocationLat,orgLocationLong}= getOrganization;

       if(getOrgPostsByName.getOrgPostsByName){
       const {body,username,createdAt,likeCount,commentCount} = getOrgPostsByName.getOrgPostsByName;
       }

       postMarkup=(
           <Grid>
               <Container >
                    <Image className="img-organizationpage"
                       src="https://i.pinimg.com/originals/3b/8a/d2/3b8ad2c7b1be2caf24321c852103598a.jpg"
                       //size="small"
                       float="center"/>
                       <Segment>
                       <h1 className="header-organizationpage">{orgName}</h1>
                       </Segment>
                       <Segment>
                       <h4 style={{textAlign:"center"}}>Organization Description:</h4>
                       <h3>{orgDescription}</h3>
                       </Segment>
                       <Segment>
                          <h4> Add your Organization's location</h4> 
                       </Segment>
                       <Segment>
                          <h4> Add your file</h4> 
                          <FileUpload />
                           <Uploads />
                       </Segment>
                </Container>
                <Container>
                <Grid.Row>
                    <Segment>
                    <Grid.Column width={10}>
                            <Segment>
                            {user && orgOwner.username===user.username &&(
                                    <OrgPostForm />
                            )}
                            </Segment>
                            {getOrgPostsByName.getOrgPostsByName &&getOrgPostsByName.getOrgPostsByName.map(orgpost=>(
                                <OrgPostCard orgpost={orgpost} />
                            ))
                            }
                    </Grid.Column>
                    </Segment>
                </Grid.Row>
                </Container>
           </Grid>
       )
   }
   return postMarkup;

}


const FETCH_SINGLEORG_QUERY=gql`
    query($orgId:ID!){
        getOrganization(orgId:$orgId){
            id
            orgName
            orgDescription
            orgLocationLat
            orgLocationLong
            orgOwner{
                id username
            }
            
        }
    }
`;

const FETCH_SINGLEORGPOST_QUERY= gql`
    query($orgname:String!){
        getOrgPostsByName(orgname:$orgname){
            id
            body
            username
            createdAt
            comments{
                id username
            }
            likes{
                username
            }
            likeCount
            commentCount
        }
    }
`;

export default SingleOrg