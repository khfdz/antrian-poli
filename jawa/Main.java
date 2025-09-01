import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.io.*;
import java.net.*;

public class Main {
    public static void main(String[] args) {
        JFrame frame = new JFrame("API Caller");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // Fullscreen
        frame.setExtendedState(JFrame.MAXIMIZED_BOTH); 
        frame.setLayout(new BorderLayout());

        // Panel input atas
        JPanel topPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        JLabel label = new JLabel("No Rawat:");
        JTextField textField = new JTextField(25);
        JButton button = new JButton("Kirim PUT API");

        topPanel.add(label);
        topPanel.add(textField);
        topPanel.add(button);

        // Area response
        JTextArea responseArea = new JTextArea();
        responseArea.setFont(new Font("Monospaced", Font.PLAIN, 14));
        responseArea.setLineWrap(true);
        responseArea.setWrapStyleWord(true);

        JScrollPane scrollPane = new JScrollPane(responseArea);
        scrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_ALWAYS);

        // Tambah panel ke frame
        frame.add(topPanel, BorderLayout.NORTH);
        frame.add(scrollPane, BorderLayout.CENTER);

        // Action tombol
        button.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                String noRawat = textField.getText().trim();
                if(noRawat.isEmpty()) {
                    JOptionPane.showMessageDialog(frame, "Isi dulu no_rawat!", "Error", JOptionPane.ERROR_MESSAGE);
                    return;
                }

                String url = "http://localhost:1414/api/reg-periksa/panggil?no_rawat=" + noRawat;
                try {
                    HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
                    conn.setRequestMethod("PUT");
                    conn.setRequestProperty("Accept", "application/json");
                    conn.setDoOutput(false); // tidak kirim body

                    // Baca response
                    BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder response = new StringBuilder();
                    String line;
                    while((line = br.readLine()) != null) {
                        response.append(line).append("\n");
                    }
                    br.close();

                    responseArea.setText(response.toString());
                } catch(Exception ex) {
                    responseArea.setText("Error: " + ex.getMessage());
                }
            }
        });

        frame.setVisible(true);
    }
}
