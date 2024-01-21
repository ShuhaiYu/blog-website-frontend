import axios from 'axios'
import { useState } from 'react'
import { useContext } from 'react'
import { UserContext } from '../App'
import { filterPaginationData } from '../common/filter-pagination-data'
import { useEffect } from 'react'
import Loader from '../components/loader.component'
import NoDataMessage from '../components/nodata.component'
import LoadMoreDataBtn from '../components/load-more.component'
import NotificationCard from '../components/notification-card.component'
import AnimatedPage from '../common/page-animation'

const Notifications = () => {

    const { userAuth, userAuth: { access_token, new_notification_available } , setUserAuth} = useContext(UserContext)

    const [filter, setFilter] = useState("all")
    const [notifications, setNotifications] = useState(null)

    let filterOptions = ["all", "like", "comment", "reply"]

    const fetchNotifications = ({ page, deletedDocCount = 0 }) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/notifications", {
            page, filter, deletedDocCount
        }, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
            .then(async({ data: { notifications: data } }) => {
                if (new_notification_available) {
                    setUserAuth({ ...userAuth, new_notification_available: false })
                }
                
                let formatedData = await filterPaginationData({ state: notifications, data, page, countRoute: "/all-notifications-count", data_to_send: { filter }, user: access_token });
                setNotifications(formatedData);
                console.log(formatedData);
            })
            .catch((err) => {
                console.log(err);
            })

    }

    const handleFilter = (e) => {
        setFilter(e.target.innerText.toLowerCase())

        setNotifications(null)
    }

    useEffect(() => {
        if (access_token) {
            fetchNotifications({ page: 1 });
        }
    }
        , [access_token, filter]);


    return (
        <div>
            <h1 className='max-md:hidden'>Notifications</h1>
            <div className='my-8 flex gap-6'>
                {
                    filterOptions.map((option, index) => {
                        return (
                            <button key={index} className={"py-2 " + (filter === option ? "btn-dark" : "btn-light")} onClick={handleFilter}>
                                {option}
                            </button>
                        )
                    })
                }

            </div>
            {
                notifications !== null ?
                    <>
                        {
                            notifications.results.length?
                            notifications.results.map((notification, index) => {
                                return (
                                    <AnimatedPage key={index} transition={{delay:index*0.08}}>
                                        <NotificationCard data={notification} index={index} notificationState={{notifications, setNotifications}} />
                                    </AnimatedPage>
                                )
                            })
                            : <NoDataMessage message="No Notifications" />
                        }
                        <LoadMoreDataBtn state={notifications} fetchDataFunction={fetchNotifications} additionalParam={{deletedDocCount:notifications.deletedDocCount}} />
                    </>
                    :
                    <Loader />
            }
        </div>
    )
}

export default Notifications