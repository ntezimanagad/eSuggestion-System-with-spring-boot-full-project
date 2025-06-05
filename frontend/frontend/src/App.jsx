import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Register from './components/Register'
import Login from './components/Login'
import PrivateRoute from './components/PrivateRoute'
import UserDashboard from './components/UserDashboard'
import AdminDashboard from './components/AdminDashboard'
import Feedback from './components/Feedback'
import ResetPassword from './components/ResetPassword'
import UpdateSuggestion from './components/UpdateSuggestion'
import AddSuggestion from './components/AddSuggestion'
import Home from './components/Home'
import Setting from './components/Setting'
import SuggestionType from './components/SuggestionType'
import ViewFeedback from './components/ViewFeedback'

function App() {

  return (
    <>
      <Router>
        {/* <Navbar/> */}
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/reset" element={<ResetPassword/>}/>
          <Route path="/user" element={<PrivateRoute role="USER"><UserDashboard/></PrivateRoute>}/>
          <Route path="/admin" element={<PrivateRoute role="ADMIN"><AdminDashboard/></PrivateRoute>}/>
          <Route path="/feedback" element={<PrivateRoute role="ADMIN"><Feedback /></PrivateRoute>}/>
          <Route path="/update-suggestion/:id" element={ <PrivateRoute role="USER"> <UpdateSuggestion/></PrivateRoute>}/>
          <Route path="/add-suggestion" element={ <PrivateRoute role="USER"> <AddSuggestion /></PrivateRoute>}/>
          <Route path="/setting" element={<PrivateRoute roles={['USER', 'ADMIN']}><Setting /></PrivateRoute>} />
          <Route path="/suggestiontype" element={ <PrivateRoute role="ADMIN"> <SuggestionType /></PrivateRoute>}/>
          <Route path="/viewfeedback" element={ <PrivateRoute role="ADMIN"> <ViewFeedback /></PrivateRoute>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
