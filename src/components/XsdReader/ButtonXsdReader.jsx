import Button from '@mui/material/Button';

const ButtonXsdReader = ({
  handleXsdChange,
  handleDragOver,
  handleDrop,
  parseXsd,
}) => {
  return (
    <div
      style={{
        border: '2px #ccc solid',
        borderRadius: '21px',
        height: '240px',
        padding: '20px',
        marginTop: '20px',
        backgroundColor: '#F5F7FA',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <span
        style={{
          color: '#1A1B1F',
          marginBottom: '20px',
          fontFamily: 'Montserrat',
          fontSize: '40px',
        }}
      >
        Перетащите BPMN-файл сюда
      </span>
      <span style={{ color: 'rgba(26, 27, 31, 0.64)' }}>
        или нажмите на кнопку
      </span>

      <Button
        className="download"
        variant="contained"
        component="label"
        style={{ marginTop: '20px', padding: '8px 25px' }}
      >
        Выбрать файл
        <input
          type="file"
          accept=".bpmn"
          style={{ display: 'none' }}
          onChange={handleXsdChange}
          multiple
        />
      </Button>

      {/* <button
        className="analyz"
        onClick={parseXsd}
        style={{ marginTop: '20px' }}
      >
        Анализировать BPMN
      </button> */}
    </div>
  );
};
export default ButtonXsdReader;
