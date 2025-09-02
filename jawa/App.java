import javax.swing.*;
import java.awt.event.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class App {
    public static void main(String[] args) {
        JFrame frame = new JFrame("Panggil Antrian");
        JButton button = new JButton("Panggil Antrian");

        button.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    String no_rawat = "2025/08/20/000234";
                    String apiUrl = "http://localhost:1414/api/reg-periksa/panggil?no_rawat=" + no_rawat;

                    URL url = new URL(apiUrl);
                    HttpURLConnection con = (HttpURLConnection) url.openConnection();
                    con.setRequestMethod("PUT");
                    con.setConnectTimeout(5000); // timeout 5 detik
                    con.setReadTimeout(5000);

                    int responseCode = con.getResponseCode();

                    // pilih input stream sesuai status
                    InputStream stream = (responseCode >= 200 && responseCode < 300) 
                        ? con.getInputStream() 
                        : con.getErrorStream();

                    StringBuilder response = new StringBuilder();
                    if (stream != null) {
                        BufferedReader in = new BufferedReader(new InputStreamReader(stream));
                        String inputLine;
                        while ((inputLine = in.readLine()) != null) {
                            response.append(inputLine);
                        }
                        in.close();
                    }

                    JOptionPane.showMessageDialog(
                        frame,
                        "Response (" + responseCode + "):\n" + response.toString()
                    );

                } catch (Exception ex) {
                    ex.printStackTrace();
                    JOptionPane.showMessageDialog(frame, "Terjadi error: " + ex.getMessage());
                }
            }
        });

        frame.add(button);
        frame.setSize(300, 200);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLocationRelativeTo(null); // center window
        frame.setVisible(true);
    }
}
