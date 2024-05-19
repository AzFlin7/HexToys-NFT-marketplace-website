import { useEnsName } from "wagmi"
import { format } from "date-fns";
import { NetworkParams, formatNum, getCurrencyInfoFromAddress, shorter } from "../../utils"

function EventItem(props) {
  const { event } = props;
  const fromEnsName = useEnsName({ address: event?.fromUser?.address })
  const toEnsName = useEnsName({ address: event?.toUser?.address })
  return (
    <>
      <tr>
        <td>
          <p>{event.name}</p>
        </td>
        <td>
          <div className='price-wrapper'>
            {
              event.price > 0 &&
              <>
                <img src={getCurrencyInfoFromAddress(event.tokenAdr).logoURI} alt={''} />
                <p>{formatNum(event.price)}</p>
              </>
            }
          </div>
        </td>
        <td>
          <p>{event.amount}</p>
        </td>
        <td>
          <div className='price-wrapper'>
            {
              event.fromUser &&
              <>
                <img src={event.fromUser.lowLogo} onClick={() => window.open(`/profile/${event.fromUser.address}`)} alt={''} />
                <p>
                  {event.fromUser.name === 'NoName' ? fromEnsName?.data || shorter(event.from) : event.fromUser.name}
                </p>
              </>
            }
          </div>
        </td>
        <td>
          <div className='price-wrapper'>
            {
              event.toUser &&
              <>
                <img src={event.toUser.lowLogo} onClick={() => window.open(`/profile/${event.toUser.address}`)} alt={''} />
                <p>
                  {event.toUser.name === 'NoName' ? toEnsName?.data || shorter(event.to) : event.toUser.name}
                </p>
              </>
            }
          </div>
        </td>
        <td>
          <div className='date-wrapper'>
            <p>{format(event.timestamp * 1000, "yyyy-MM-dd HH:mm")}</p>
          </div>
        </td>
      </tr>
    </>
  );
}

export default EventItem;