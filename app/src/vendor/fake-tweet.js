import React from 'react'
import './fake-tweet.css'
import Twemoji from 'react-twemoji'

function Tweet(props) {

    function styleNumber(num) {
        let div = num / 1000000
        if (div >= 1) {
            return div.toFixed(1).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1') + "M"
        }
        div = num / 1000
        if (div >= 1) {
            return div.toFixed(1).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1') + "K"
        }
        return num
    }

    const verifiedIcon =
        <div className="icon">
            <svg viewBox="0 0 24 24" aria-label="Verified account" className="verified-icon-svg">
                <g>
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path>
                </g>
            </svg>
        </div>

    const lockIcon =
        <div className="icon">
            <svg viewBox="0 0 24 24" aria-label="Locked account" className="lock-icon-svg">
                <g>
                    <path d="M19.75 7.31h-1.88c-.19-3.08-2.746-5.526-5.87-5.526S6.32 4.232 6.13 7.31H4.25C3.01 7.31 2 8.317 2 9.56v10.23c0 1.24 1.01 2.25 2.25 2.25h15.5c1.24 0 2.25-1.01 2.25-2.25V9.56c0-1.242-1.01-2.25-2.25-2.25zm-7 8.377v1.396c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-1.396c-.764-.3-1.307-1.04-1.307-1.91 0-1.137.92-2.058 2.057-2.058 1.136 0 2.057.92 2.057 2.056 0 .87-.543 1.61-1.307 1.91zM7.648 7.31C7.838 5.06 9.705 3.284 12 3.284s4.163 1.777 4.352 4.023H7.648z"></path>
                </g>
            </svg>
        </div>

    const nightMode = typeof props.config.nightMode !== "undefined" && props.config.nightMode === true

    return (
        <div className={"tweet" + (nightMode ? " nightmode" : "")}>
            <div className="user-info">
                <div className="avatar-container">
                    <img className="avatar" src={props.config.user.avatar}
                        alt={props.config.user.name + " avatar"} />
                </div>
                <div className="user-info-right">
                    <div className="user-name">
                        <Twemoji options={{ className: 'twemoji-sm' }} className="user-name-txt">
                            <span className="fake-link">{props.config.user.name}</span>
                        </Twemoji>
                        {props.config.user.verified && verifiedIcon}
                        {props.config.user.locked && !props.config.user.verified && lockIcon}
                    </div>
                    <div className="user-nickname">@{props.config.user.nickname}</div>
                </div>
            </div>
            <div className="tweet-text">
                { typeof props.config.text !== "undefined" && props.config.text !== '' && <div className="txt"><Twemoji options={{ className: 'twemoji-bg' }}>{props.config.text}</Twemoji></div>}
                {typeof props.config.image !== "undefined" && props.config.image !== "" &&
                    <div className="image-container">
                        <img src={props.config.image} alt="" />
                    </div>
                }
            </div>
            <div className="date-app-details" >
                {props.config.date} · <span dangerouslySetInnerHTML={{ __html: props.config.app}} className="fake-link app" />
            </div>
            <div className="rt-likes">
                <span className="fake-link num-rts"><strong>{styleNumber(props.config.retweets)}</strong> Retweets</span>
                <span className="fake-link num-likes"><strong>{styleNumber(props.config.likes)}</strong> Likes</span>
            </div>
        </div>
    )
}

export default Tweet
